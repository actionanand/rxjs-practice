import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { debounceTime, distinctUntilChanged, startWith, tap, delay, map, concatMap, switchMap, 
  withLatestFrom, concatAll, shareReplay, throttle } from 'rxjs/operators';
import { merge, fromEvent, Observable, concat, interval, forkJoin } from 'rxjs';

import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxjsLoggingLevel, setRxjsLoggingLevel } from '../common/debug';
import { Store } from '../common/store.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;
  courseId: string;

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute, private store: Store) {  }

  ngOnInit() {

    this.courseId = this.route.snapshot.params['id'];

    this.course$ = (createHttpObservable(`/api/courses/${this.courseId}`) as Observable<Course>)
      .pipe(
        debug(RxjsLoggingLevel.INFO, 'Courses value')
      );

    this.lessons$ = this.loadLessons();

    setRxjsLoggingLevel(RxjsLoggingLevel.TRACE);

    forkJoin(this.course$, this.lessons$)
      .pipe(
        tap(([course, lesson]) => {
          console.log('Courses : ', course);
          console.log('Lessons : ', lesson)
        })
      )
      .subscribe()
  }

  ngAfterViewInit() {
  /* 
    const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(searchTerm => this.loadLessons(searchTerm))
      );

    const initialLessons$ = this.loadLessons();

    this.lessons$ = concat(initialLessons$, searchLessons$);
    
  */

    this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''), // initial searchTerm is ''
        debug(RxjsLoggingLevel.TRACE, 'Search Term'),
        debounceTime(500),
        // throttle(() => interval(500)),
        distinctUntilChanged(),
        switchMap(searchTerm => this.loadLessons(searchTerm)),
        debug(RxjsLoggingLevel.INFO, 'lessons value'),
      );
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(resp => resp['payload'])
      );
  }

}
