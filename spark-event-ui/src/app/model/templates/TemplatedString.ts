import {TemplateStringEntry} from './TemplateStringDictionary';

export class TemplatedString {
  get text(): string {
    return this.templateEntry.template;
  }

  readonly templateEntry: TemplateStringEntry;
  // templateVariables: {[key: string]: string};

  constructor(templateEntry: TemplateStringEntry) {
    this.templateEntry = templateEntry;
  }

}
