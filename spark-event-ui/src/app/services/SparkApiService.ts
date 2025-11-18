import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, Subscription, of } from 'rxjs';
import { skip, take, map, tap, mergeMap, flatMap, shareReplay, combineAll } from 'rxjs/operators';

import { SparkEvent } from '../model/sparkevents/SparkEvent';
import { SparkCtx } from '../model/trackers/SparkCtx';

@Injectable()
class SparkApiService {

  /** singleton (anti-pattern..) : caching loaded events */
  sparkCtx = new SparkCtx();

  constructor(private httpClient: HttpClient) {
  }

  loadCtx(): Observable<SparkCtx> {
    if (this.sparkCtx.events.length > 0) {
      return of(this.sparkCtx);
    }
    return this.httpClient.get<any[]>('/api/spark-event/all').pipe(
        map(data => {
          let events = SparkEvent.fromAnyJsonArray(1, data);
          this.sparkCtx.addEvents(events);
          return this.sparkCtx;
        })
    );
  }

  eventById(eventNum: number) : Observable<SparkEvent | undefined> {
    return this.loadCtx().pipe(
      map( ctx =>
        ctx.events.find( e => e.eventNum === eventNum)
      )
    );
  }

  findLastSqlEventWithPlanInfoBySqlEventId(sqlId: number) : Observable<SparkEvent | undefined> {
    return this.loadCtx().pipe(
      map( ctx => {
        const events = ctx.events.filter(e => e.sqlExecIdOpt == sqlId && e.sparkPlanInfoOpt !== undefined);
        return events.length > 0 ? events[events.length - 1] : undefined;
      }));
  }

  getEventById(eventNum: number): Observable<SparkEvent> {
    return this.httpClient.get<any>('/api/spark-event/' + eventNum).pipe(
      map(data => {
        let event = SparkEvent.fromAnyJson(eventNum, data);
        const json = event.toSparkJson();
        console.log('GET SparkEvent data, toSparkJson', data, json);
        return event;
      })
    );
  }
}

export default SparkApiService
