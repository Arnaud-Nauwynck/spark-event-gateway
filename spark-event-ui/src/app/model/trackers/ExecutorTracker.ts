import {SparkListenerExecutorAdded, SparkListenerExecutorRemoved} from '../sparkevents/SparkEvent';

/**
 * event tracker for Executor
 */
export class ExecutorTracker {

  readonly executorId: string;

  executorAddedEvent: SparkListenerExecutorAdded|undefined;
  executorRemovedEvent: SparkListenerExecutorRemoved|undefined;

  //---------------------------------------------------------------------------------------------

  constructor(executorId: string) {
    this.executorId = executorId;
  }

  //---------------------------------------------------------------------------------------------

  onExecutorAddedEvent(event: SparkListenerExecutorAdded) {
    this.executorAddedEvent = event;
  }

  onExecutorRemovedEvent(event: SparkListenerExecutorRemoved) {
    this.executorRemovedEvent = event;
  }

}
