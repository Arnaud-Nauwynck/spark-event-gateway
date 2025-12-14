import {TemplateStringDictionary} from './TemplateStringDictionary';
import {TemplatedString} from './TemplatedString';
import {CallSiteTemplatedStringDTO, TemplateDictionariesEntriesDTO} from '../../rest';

export class CallSiteTemplated {
  readonly shortMessageTemplated: TemplatedString;
  readonly longMessageTemplated: TemplatedString;

  get shortMessage(): string { return this.shortMessageTemplated.text; }
  get longMessage(): string { return this.longMessageTemplated.text; }

  constructor(callSiteShort: TemplatedString, callSiteLong: TemplatedString) {
    this.shortMessageTemplated = callSiteShort;
    this.longMessageTemplated = callSiteLong;
  }
}

export interface EntryIdsToResolve {
  callSiteShortEntryIds: number[];
  callSiteLongEntryIds: number[];
  planDescriptionEntryIds: number[];
}

export class TemplateDictionariesRegistry {

  callSiteShortDictionary = new TemplateStringDictionary('callSiteShort');
  callSiteLongDictionary = new TemplateStringDictionary('callSiteLong');
  planDescriptionDictionary = new TemplateStringDictionary('planDescription');

  entryIdsToResolve(): EntryIdsToResolve {
    return {
      callSiteShortEntryIds: this.callSiteShortDictionary.entryIdsToResolve(),
      callSiteLongEntryIds: this.callSiteLongDictionary.entryIdsToResolve(),
      planDescriptionEntryIds: this.planDescriptionDictionary.entryIdsToResolve(),
    };
  }

  resolveCallSiteFromDTO(src: CallSiteTemplatedStringDTO): CallSiteTemplated {
    return this.resolveCallSite(src.shortTemplateId!, src.longTemplateId!);
  }

  resolveCallSite(shortTemplateId: number, longTemplateId: number): CallSiteTemplated {
    const shortMessage = this.callSiteShortDictionary.resolve(shortTemplateId);
    const longMessage = this.callSiteLongDictionary.resolve(longTemplateId);
    return new CallSiteTemplated(shortMessage, longMessage);
  }

  registerEntriesFromDTO(dicsEntriesDTOs: TemplateDictionariesEntriesDTO) {
    this.callSiteShortDictionary.registerTemplateEntries(dicsEntriesDTOs.callSiteShortEntries!);
    this.callSiteLongDictionary.registerTemplateEntries(dicsEntriesDTOs.callSiteLongEntries!);
    this.planDescriptionDictionary.registerTemplateEntries(dicsEntriesDTOs.planDescriptionEntries!);
  }

}
