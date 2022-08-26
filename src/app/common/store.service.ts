import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { delayWhen, filter, map, retryWhen, shareReplay, tap } from 'rxjs/operators';

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

  onSaveCourse(id: number, changes): Observable<any> {
    const courses = this.subject.getValue();
    const courseInd = courses.findIndex(course => course.id === id);
    const newCourses = courses.slice(0);

    newCourses[courseInd] = {
      ...newCourses[courseInd], 
      ...changes
    };

    this.subject.next(newCourses);

    return fromPromise(fetch(`api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }

  onSelectCourseById(id: number): Observable<Course> {
    return this.courses$.pipe(
      map(resp => resp.find(course => course.id == id)),
      filter(course => !!course)  // to prevent undefined in the beginning as we've empty array (subject property), this condition will filterout falsy
    );
  }

  ngOnDestroy(): void {
    if (this.courseSub) {
      this.courseSub.unsubscribe();
    }
  }
}