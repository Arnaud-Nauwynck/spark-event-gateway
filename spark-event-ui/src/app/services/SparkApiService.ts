import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {
  NewCallSiteLongTemplateEventSummaryDTO,
  NewCallSiteShortTemplateEventSummaryDTO,
  NewPlanDescriptionTemplateEventSummaryDTO,
  NodeDuplicatesWithinSqlExecAnalysisDTO, SparkAppSummaryDTO, SparkClusterDTO, SparkEventSummaryDTO, SqlExecutionEventsDTO
} from '../rest';
import {SparkEvent as SparkEventDTO} from '../rest';

import {SparkEvent} from '../model/sparkevents/SparkEvent';
import {SparkCtx} from '../model/trackers/SparkCtx';
import {SqlExecTracker} from '../model/trackers/SqlExecTracker';
import {SparkContextTracker} from '../model/trackers/SparkContextTracker';
import {SparkAppSummary} from '../model/summary/SparkAppSummary';
import {SparkCluster} from '../model/summary/SparkCluster';
import {EntryIdsToResolve, TemplateDictionariesRegistry} from '../model/templates/TemplateDictionariesRegistry';
import {SparkAppKey} from '../model/SparkAppKey';
import SparkSQLExecutionEventSummary, {
  NewCallSiteLongTemplateEventSummary,
  NewCallSiteShortTemplateEventSummary,
  NewPlanDescriptionTemplateEventSummary,
  SparkEventSummary
} from '../model/summary/SparkEventSummary';
import {SparkSqlExecKey} from '../model/SparkSqlExecKey';


@Injectable()
export class SparkApiService {

  /** singleton (anti-pattern..) : caching loaded events */
  sparkCtx = new SparkCtx();

  cachedSparkClusters: SparkCluster[] | undefined;

  constructor(private httpClient: HttpClient) {
  }

  loadCtx(): Observable<SparkCtx> {
    if (this.sparkCtx.events.length > 0) {
      return of(this.sparkCtx);
    }
    return this.httpClient.get<SparkEventDTO[]>('/api/spark-event/all').pipe(
        map(data => {
          let events = SparkEvent.fromDTOs(data);
          this.sparkCtx.addEvents(events);
          return this.sparkCtx;
        })
    );
  }

  // TODO Deprecated
  eventById(eventNum: number) : Observable<SparkEvent | undefined> {
    return this.loadCtx().pipe(
      map( ctx =>
        ctx.events.find( e => e.eventNum === eventNum)
      )
    );
  }

  // TODO Deprecated
  findLastSqlEventWithPlanInfoBySqlEventId(sqlId: number) : Observable<SparkEvent | undefined> {
    return this.loadCtx().pipe(
      map( ctx => {
        const events = ctx.events.filter(e => e.sqlExecIdOpt == sqlId && e.sparkPlanInfoOpt !== undefined);
        return events.length > 0 ? events[events.length - 1] : undefined;
      }));
  }



  // TODO Deprecated
  getEventById(eventNum: number): Observable<SparkEvent> {
    return this.httpClient.get<SparkEventDTO>('/api/spark-event/' + eventNum).pipe(
      map(data => {
        let event = SparkEvent.fromDTO(data);
        // const json = event.toSparkJson();
        // console.log('GET SparkEvent data, toSparkJson', data, json);
        return event;
      })
    );
  }

  sparkClusters$(): Observable<SparkCluster[]> {
    if (this.cachedSparkClusters) {
      return of(this.cachedSparkClusters);
    }
    return this.httpClient.get<SparkClusterDTO[]>('/api/spark-apps/clusters').pipe(
      map(data => {
        let res = SparkCluster.fromDTOs(data);
        // TODO cache?
        this.cachedSparkClusters = res;
        // console.log('GET SparkClusters data', data, res);
        return res;
      })
    );
  }

  sparkClusterByName$(clusterName: string): Observable<SparkCluster|undefined> {
    if (this.cachedSparkClusters) {
      let res = this.cachedSparkClusters.find(d => d.clusterName === clusterName);
      if (res) {
        return of(res);
      }
    }
    // return this.sparkClusters$().pipe(
    //   map(clusters => clusters.find(x => x.clusterName === clusterName))
    // );
    return this.httpClient.get<SparkClusterDTO>(`/api/spark-apps/cluster/${clusterName}`).pipe(
      map(data => {
        let res = SparkCluster.fromDTO(data);
        // TODO cache?
        if (!this.cachedSparkClusters) {
          this.cachedSparkClusters = [];
        }
        this.cachedSparkClusters.push(res);
        // console.log('GET SparkClusters data', data, res);
        return res;
      })
    );
  }

  cachedSparkClusterByNameOpt(clusterName: string): SparkCluster|undefined {
    return this.cachedSparkClusters?.find(x => x.clusterName === clusterName);
  }

  clusterSparkAppSummaries$(clusterName: string): Observable<SparkAppSummary[]> {
    const cachedCluster = this.cachedSparkClusterByNameOpt(clusterName);
    if (cachedCluster && cachedCluster.sparkAppSummaries !== undefined) {
      return of(cachedCluster.sparkAppSummaries);
    }
    return this.httpClient.get<SparkAppSummaryDTO[]>(`/api/spark-apps/cluster/${clusterName}/spark-apps`).pipe(
      map(data => {
        let res = data.map(x => SparkAppSummary.fromDTO(x));

        if (cachedCluster) {
          cachedCluster.sparkAppSummaries = res;
        }
        // TODO cache?
        // this.cachedSparkClusters = res;
        // console.log('GET SparkClusters data', data, res);
        return res;
      })
    );
  }

  protected sparkAppRequestUrl(sparkAppKey: SparkAppKey): string {
    return `/api/spark-apps/cluster/${sparkAppKey.clusterName}/spark-app/${sparkAppKey.sparkAppName}`;
  }
  protected sqlExecRequestUrl(sqlExecKey: SparkSqlExecKey) {
    return this.sparkAppRequestUrl(sqlExecKey.sparkAppKey) + '/sql/' + sqlExecKey.execId;
  }

  sparkAppSummary$(sparkAppKey: SparkAppKey): Observable<SparkAppSummary|undefined> {
    const clusterName = sparkAppKey.clusterName;
    const sparkAppName = sparkAppKey.sparkAppName;
    const cachedCluster = this.cachedSparkClusterByNameOpt(clusterName);
    if (cachedCluster && cachedCluster.sparkAppSummaries !== undefined) {
      const found = cachedCluster.sparkAppSummaries.find(x => x.sparkAppName === sparkAppName);
      if (found) return of(found);
    }
    return this.clusterSparkAppSummaries$(clusterName).pipe(
      map(summaries => summaries.find(x => x.sparkAppName === sparkAppName))
    );
  }

  sparkAppEventSummaries$(sparkAppKey: SparkAppKey, from: number, limit: number): Observable<SparkEventSummary[]> {
    const reqUrl = this.sparkAppRequestUrl(sparkAppKey) + `/event-summaries?from=${from}&limit=${limit}`;
    return this.httpClient.get<SparkEventSummaryDTO[]>(reqUrl).pipe(
      map(dtos => {
        const dics = new TemplateDictionariesRegistry();
        return dtos.map(dto => SparkEventSummary.fromTypeDTO(dto, dics));
      })
    );
  }

  sparkAppSqlSummary$(sparkSqlKey: SparkSqlExecKey): Observable<SparkSQLExecutionEventSummary|undefined> {
    return this.sparkAppSummary$(sparkSqlKey.sparkAppKey).pipe(
      map(sparkAppSummary => {
        if (sparkSqlKey.execId && sparkAppSummary) {
          return sparkAppSummary.sqlExecSummaryById(sparkSqlKey.execId);
        } else {
          // TODO
          return undefined;
        }
      })
    );
  }

  sparkAppSqlEvents$(sqlExecKey: SparkSqlExecKey): Observable<SparkEvent[]> {
    const reqUrl = this.sqlExecRequestUrl(sqlExecKey) + `/events`;
    return this.httpClient.get<SqlExecutionEventsDTO>(reqUrl).pipe(
      map(data => {
        let events= [
          ...SparkEvent.fromDTOs(data.startAppEvents!),
          ...SparkEvent.fromDTOs(data.events!)
        ];
        // this.sparkCtx.addEvents(events);
        return events;
      })
    );
  }

  sparkAppSqlExecTracker$(sqlExecKey: SparkSqlExecKey, upToEventNumOpt: number|undefined): Observable<SqlExecTracker|undefined> {
    // if (this.sparkCtx.events.length > 0) {
    //   return of(this.replayEventsToSqlExecTracker(sqlExecKey, this.sparkCtx.events, upToEventNumOpt));
    // }
    return this.sparkAppSqlEvents$(sqlExecKey).pipe(
      map(events => this.replayEventsToSqlExecTracker(sqlExecKey.execId, events, upToEventNumOpt))
    );
  }

  replayEventsToSqlExecTracker(sqlId: number, events: SparkEvent[], upToEventNumOpt: number|undefined): SqlExecTracker|undefined {
    if (events.length === 0) {
      return undefined; // new SqlExecTracker(sqlId);
    }
    const replay = new SparkContextTracker();
    replay.retainSqlExecPredicate = (x: SqlExecTracker) => x.sqlId === sqlId;
    const replayEvents = (upToEventNumOpt)? events.filter(x => x.eventNum <= upToEventNumOpt) : events;
    replay.onEvents(replayEvents);
    return replay.findSqlExec(sqlId);
  }

  performSparkPlanNodeDuplicatesAnalysis$(sqlExecKey: SparkSqlExecKey): Observable<NodeDuplicatesWithinSqlExecAnalysisDTO> {
    const reqUrl = this.sqlExecRequestUrl(sqlExecKey) + '/node-duplicates-analysis';
    return this.httpClient.get<NodeDuplicatesWithinSqlExecAnalysisDTO>(reqUrl).pipe(
      map(dto => {
        // console.log('Node Duplicates Analysis Response:', dto);
        return dto;
      })
    );
  }
}

