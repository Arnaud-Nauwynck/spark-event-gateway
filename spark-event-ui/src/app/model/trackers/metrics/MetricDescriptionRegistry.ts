import {registerStdMetricDescriptions} from './MetricDescriptions';
import {EnumMetricType, GenericMetricDescription, MetricDescription} from './MetricDescription';

/**
 *
 */
export class MetricDescriptionRegistry {
  static readonly INSTANCE = new MetricDescriptionRegistry();

  readonly registry: Map<string, MetricDescription> = new Map<string, MetricDescription>();

  constructor() {
    registerStdMetricDescriptions(this);
  }

  byName(name: string) {
    return this.registry.get(name);
  }

  register(type: MetricDescription): void {
    this.registry.set(type.name, type);
  }

  registers(types: MetricDescription[]): void {
    types.forEach(t => this.register(t));
  }

  resolve(name: string, metricType: string): MetricDescription {
    let found = this.byName(name);
    if (found) {
      return found;
    } else {
      // NOT found! ... register a generic one
      // console.log("MetricDescriptionRegistry: registering generic metric description for name='" + name + "', type='" + metricType + "'");

      console.log("export class " + name + "MetricDescription extends MetricDescription {\n" +
                  "  constructor() {\n" +
                  "    super('" + name + "', '" + metricType + "', 'unit?');\n" +
                  "  }\n" +
                  "}\n");

      const generic = new GenericMetricDescription(name, metricType as EnumMetricType);
      this.register(generic);
      return generic;
    }
  }
}

