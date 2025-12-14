export * from './sparkAppsRestController.service';
import { SparkAppsRestControllerService } from './sparkAppsRestController.service';
export * from './sparkEventRestController.service';
import { SparkEventRestControllerService } from './sparkEventRestController.service';
export const APIS = [SparkAppsRestControllerService, SparkEventRestControllerService];
