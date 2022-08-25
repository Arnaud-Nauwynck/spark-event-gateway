import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, Subscription, of } from 'rxjs';
import { skip, take, map, tap, mergeMap, flatMap, shareReplay, combineAll } from 'rxjs/operators';

import { SparkEvent } from '../model/SparkEvent';

@Injectable()
export class SparkApiService {
  
  constructor(private httpClient: HttpClient) {
  }
  
  listEvents(): Observable<SparkEvent[]> {
    return this.httpClient.get<any[]>('/api/spark-event/all').pipe(
        map(data => SparkEvent.fromAnyJsonArray(data))
    );
  }

}