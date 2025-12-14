import {
  RepeatedLongestSqlExecsPerCallSiteDTO,
  RepeatedLongestTopLevelJobExecsPerCallSiteDTO, SparkApplicationConfigDTO, SparkAppMetricsDTO, SparkAppSummaryDTO
} from '../../rest';
import SparkSQLExecutionEventSummary, {SparkTopLevelJobExecEventSummary} from './SparkEventSummary';
import {CallSiteTemplated, TemplateDictionariesRegistry} from '../templates/TemplateDictionariesRegistry';
import {SparkAppKey} from '../SparkAppKey';

/**
 *
 */
export class RepeatedLongestSqlExecsPerCallSite {
  constructor(public readonly callSite: CallSiteTemplated,
              public readonly count: number,
              public readonly durationSum: number,
              public readonly sqlExecs: SparkSQLExecutionEventSummary[]) {
  }

  static fromDTO(src: RepeatedLongestSqlExecsPerCallSiteDTO, dics: TemplateDictionariesRegistry) {
    return new RepeatedLongestSqlExecsPerCallSite(dics.resolveCallSiteFromDTO(src.callSite!),
      src.count!, src.durationSum!,
      (src.topSqlExecs ?? []).map(e => SparkSQLExecutionEventSummary.fromDTO(e, dics))
    );
  }

  static fromDTOs(src: RepeatedLongestSqlExecsPerCallSiteDTO[], dics: TemplateDictionariesRegistry): RepeatedLongestSqlExecsPerCallSite[] {
    return src.map(e => RepeatedLongestSqlExecsPerCallSite.fromDTO(e,dics));
  }
}

/**
 *
 */
export class RepeatedLongestTopLevelExecsPerCallSite {
  constructor(public readonly callSite: CallSiteTemplated,
              public readonly count: number,
              public readonly durationSum: number,
              public readonly jobExecs: SparkTopLevelJobExecEventSummary[]) {
  }

  static fromDTO(src: RepeatedLongestTopLevelJobExecsPerCallSiteDTO, dics: TemplateDictionariesRegistry): RepeatedLongestTopLevelExecsPerCallSite {
    return new RepeatedLongestTopLevelExecsPerCallSite(dics.resolveCallSiteFromDTO(src.callSite!),
      src.count!, src.durationSum!,
      (src.topJobsExecs ?? []).map(e => SparkTopLevelJobExecEventSummary.fromDTO(e, dics))
    );
  }

  static fromDTOs(src: RepeatedLongestTopLevelJobExecsPerCallSiteDTO[], dics: TemplateDictionariesRegistry): RepeatedLongestTopLevelExecsPerCallSite[] {
    return src.map(e => RepeatedLongestTopLevelExecsPerCallSite.fromDTO(e,dics));
  }
}


/**
 *
 */
export class SparkAppSummary {
  readonly clusterName: string;
  readonly sparkAppName: string;
  get sparkAppKey(): SparkAppKey { return new SparkAppKey(this.clusterName, this.sparkAppName); }


  readonly sparkAppConfig: SparkApplicationConfigDTO;
  appMetrics: SparkAppMetricsDTO;
  // applicationStart: SparkApplicationStartEventSummaryDTO;
  // applicationEnd: SparkApplicationEndEventSummaryDTO;
  // logStart: SparkLogStartEventSummaryDTO;
  // resourceProfileAdded: SparkResourceProfileAddedEventSummaryDTO;
  // envUpdate: SparkEnvironmentUpdateEventSummaryDTO;

  // firstEventSummaries: Array<SparkAppEventSummaries200ResponseInner>;
  longestSqlExecs: SparkSQLExecutionEventSummary[] = [];
  longestTopLevelJobExecs: SparkTopLevelJobExecEventSummary[] = [];

  repeatedLongestSqlExecsPerCallSites: RepeatedLongestSqlExecsPerCallSite[] = [];
  repeatedLongestTopLevelExecsPerCallSites: RepeatedLongestTopLevelExecsPerCallSite[] = [];

  constructor(clusterName: string, sparkAppName: string,
              sparkAppConfig: SparkApplicationConfigDTO,
              appMetrics: SparkAppMetricsDTO,
              longestSqlExecs: SparkSQLExecutionEventSummary[],
              longestTopLevelJobExecs: SparkTopLevelJobExecEventSummary[],
              repeatedLongestSqlExecsPerCallSites: RepeatedLongestSqlExecsPerCallSite[],
              repeatedLongestTopLevelExecsPerCallSites: RepeatedLongestTopLevelExecsPerCallSite[]
              ) {
    this.clusterName = clusterName;
    this.sparkAppName = sparkAppName;
    this.sparkAppConfig = sparkAppConfig;
    this.appMetrics = appMetrics;
    this.longestSqlExecs = longestSqlExecs;
    this.longestTopLevelJobExecs = longestTopLevelJobExecs;
    this.repeatedLongestSqlExecsPerCallSites = repeatedLongestSqlExecsPerCallSites;
    this.repeatedLongestTopLevelExecsPerCallSites = repeatedLongestTopLevelExecsPerCallSites;
  }

  static fromDTO(src: SparkAppSummaryDTO): SparkAppSummary {
    // console.log('SparkAppSummary.fromDTO', src);
    const dics = new TemplateDictionariesRegistry();
    dics.registerEntriesFromDTO(src.templateDictionariesEntries!);

    // TOADD firstEventSummaries
    const longestSqlExecs = (src.longestSqlExecs ?? []).map(e => SparkSQLExecutionEventSummary.fromDTO(e, dics));
    const longestTopLevelJobExecs = (src.longestTopLevelJobExecs ?? []).map(e => SparkTopLevelJobExecEventSummary.fromDTO(e, dics));

    const repeatedLongestSqlExecsPerCallSites = RepeatedLongestSqlExecsPerCallSite.fromDTOs(
      src.repeatedLongestSqlExecsPerCallSites ?? [], dics);
    const repeatedLongestTopLevelJobExecsPerCallSites = RepeatedLongestTopLevelExecsPerCallSite.fromDTOs(
      src.repeatedLongestTopLevelJobExecsPerCallSites ?? [], dics);

    // resolve dic entries if any
    const entryIdsToResolve = dics.entryIdsToResolve();
    if (entryIdsToResolve.callSiteLongEntryIds.length > 0 ||
      entryIdsToResolve.callSiteShortEntryIds.length > 0 ||
      entryIdsToResolve.planDescriptionEntryIds.length > 0
    ) {
      // console.log('Need to resolve template entries', entryIdsToResolve);
      // implement API to get entries by IDs
    }

    return new SparkAppSummary(src.clusterName!, src.sparkAppName!, src.sparkAppConfig!, src.appMetrics!,
      longestSqlExecs, longestTopLevelJobExecs,
      repeatedLongestSqlExecsPerCallSites,
      repeatedLongestTopLevelJobExecsPerCallSites);
  }

  sqlExecSummaryById(execId: number): SparkSQLExecutionEventSummary|undefined {
    let found = this.longestSqlExecs.find(e => e.execId === execId);
    if (found) {
      return found;
    }
    // TODO find others
    return found;
  }

  topLevelExecSummaryById(jobId: number): SparkTopLevelJobExecEventSummary|undefined {
    let found = this.longestTopLevelJobExecs.find(e => e.jobId === jobId);
    if (found) {
      return found;
    }
    // TODO find others
    return found;
  }

}
