import { Component, OnInit } from '@angular/core';

import { interval, noop, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';

import { Course } from "../model/course";
import { createHttpObservable } from '../common/util';
import { AvailableCourses, Store } from '../common/store.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private store: Store) {

  }

  ngOnInit() {
  /*
    const http$ = createHttpObservable('/api/courses');

    const courses$: Observable<Course[]> = http$.pipe(
      tap(() => console.log('Http req executed!')),
      map(resp => Object.values(resp['payload'])),
      shareReplay<Course[]>(),
      // catchError(err => {
      //   console.log('Error occurred! ', err);
      //   return throwError(err);
      // }),
      // finalize(() => {
      //   console.log('Finalized!'); // 'finalize' will be executed either rxjs completed or error ocuured
      // }),
      retryWhen(err => err.pipe(
        delayWhen(() => timer(2000))
      ))
    );
  */

    this.beginnerCourses$ = this.store.onSelectCourse(AvailableCourses.beginner);
    
    this.advancedCourses$ = this.store.onSelectCourse(AvailableCourses.advanced);
   

    // courses$.subscribe(
    //   (courses: Course[]) => console.log(courses),
    //   noop,
    //   () => console.log('completed!')
    // );

  }

}
