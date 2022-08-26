import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';

import { Course } from '../model/course';
import { createHttpObservable } from './util';

export const AvailableCourses = {
  beginner: 'BEGINNER',
  advanced: 'ADVANCED'
};

@Injectable({
  providedIn: 'root'
})
export class Store implements OnInit, OnDestroy {

  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  courseSub: Subscription;

  constructor() {
    this.init();
  }

  ngOnInit(): void {
  }


  init() {
    const http$ = createHttpObservable('/api/courses');

    this.courseSub = http$.pipe(
      tap(() => console.log('Http req executed!')),
      map(resp => Object.values(resp['payload'])),
    ).subscribe((courses: Course[] )=> {
      console.log('Inside service ', courses);
      this.subject.next(courses);
    });
  }


  onSelectCourse(grade = 'BEGINNER'): Observable<Course[]> {
    return this.courses$.pipe(
      map(resp => resp.filter(course => course.category == grade))
    );
  }

  ngOnDestroy(): void {
    if (this.courseSub) {
      this.courseSub.unsubscribe();
    }
  }
}