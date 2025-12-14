import { StageInfo } from '../sparkevents/StageInfo';
import { SparkEvent } from '../sparkevents/SparkEvent';
import { TaskInfo } from '../sparkevents/TaskInfo';
import { SparkListenerJobStart } from '../sparkevents/SparkEvent';

export class StageUpdate {

	readonly stageInfo: StageInfo;
	readonly event: SparkEvent;

	constructor(stageInfo: StageInfo, event: SparkEvent) {
		this.stageInfo = stageInfo;
		this.event = event;
	}
}

export class StageUpdateHistory {

	readonly stageId: number;
	readonly eventUpdates: StageUpdate[]  = [];

	readonly attempts: StageAttemptHistory[]  = [];

	constructor(stageId: number) {
		this.stageId = stageId;
	}
}

export class StageAttemptHistory {
	readonly parent: StageUpdateHistory;

	constructor(parent: StageUpdateHistory) {
		this.parent = parent;
	}

}

export class TaskUpdate {
	readonly taskInfo: TaskInfo;
	readonly event: SparkEvent;

	constructor(taskInfo: TaskInfo, event: SparkEvent) {
		this.taskInfo = taskInfo;
		this.event = event;
	}

}

export class TaskHistory {
	readonly parent: StageAttemptHistory;
	readonly eventUpdates: TaskUpdate[] = [];

	constructor(parent: StageAttemptHistory) {
		this.parent = parent;
	}

}

/**
 *
 */
export class SparkCtx {

	readonly events: SparkEvent[] = [];
	readonly stageUpdates = new Map<number,StageUpdateHistory>();

	constructor() {
	}

  addEvents(event: SparkEvent[]) {
    this.events.push(...event);
  }

	addEvent(event: SparkEvent): number {
		this.events.push(event);
		return this.events.length-1;
	}

	addStageInfoUpdate(stageInfo: StageInfo, event: SparkEvent): StageUpdateHistory {
		let stageId = stageInfo.stageId;
		var updates = this.stageUpdates.get(stageId);
		if(!updates) {
			updates = new StageUpdateHistory(stageId);
			this.stageUpdates.set(stageId, updates);
		}
		updates.eventUpdates.push(new StageUpdate(stageInfo, event));
		return updates;
	}

	addTaskInfoUpdate(taskInfo: TaskInfo, event: SparkEvent) {
		// taskInfo.taskId
		// taskInfo.attempt;
	}

	findCorrespJobStart(jobId: number): SparkListenerJobStart|undefined {
		for(var i = this.events.length-1; i >= 0; i--) {
			let event = this.events[i];
			if (event.Event === 'SparkListenerJobStart') {
				let e = <SparkListenerJobStart> event;
				if (e.jobId === jobId) {
					return e;
				}
			}
		}
		return undefined;
	}
}
