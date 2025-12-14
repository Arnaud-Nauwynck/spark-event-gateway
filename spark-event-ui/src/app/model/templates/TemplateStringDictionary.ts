import {TemplatedString} from './TemplatedString';
import {TemplateStringEntryDTO} from '../../rest';

export class TemplateStringEntry {
  template: string;

  constructor(
    public readonly dic: TemplateStringDictionary,
    public readonly templateId: number,
    template: string) {
    this.template = template;
  }
}

/**
 *
 */
export class TemplateStringDictionary {
  private entries = new Map<number, TemplateStringEntry>();

  constructor(
    public readonly dictionaryName: string
  ) {
  }

  entryById(id: number): TemplateStringEntry | undefined {
    return this.entries.get(id);
  }

  textById(id: number): string {
    const entry = this.entryById(id);
    return entry?.template || '?';
  }

  resolve(templateId: number): TemplatedString {
    let templateEntry = this.entryById(templateId);
    if (! templateEntry) {
      // TODO .. should not occur!
      templateEntry = new TemplateStringEntry(this, templateId, `??${templateId}??`);
      this.entries.set(templateId, templateEntry);
    }
    return new TemplatedString(templateEntry);
  }

  registerTemplateEntries(src: TemplateStringEntryDTO[]) {
    src.forEach(e => this.registerTemplateEntry(e));
  }

  registerTemplateEntry(src: TemplateStringEntryDTO): TemplateStringEntry {
    const id = src.id!;
    const text = src.text || '';
    let res = this.entryById(id);
    if (! res) {
      res = new TemplateStringEntry(this, id, text);
      this.entries.set(id, res);
    } else {
      res.template = text;
    }
    return res;
  }

  entryIdsToResolve(): number[] {
    const res: number[] = [];
    this.entries.forEach((value, key) => {
      if (!value.template || value.template.startsWith('??')) {
        res.push(key);
      }
    });
    return res;
  }

}
