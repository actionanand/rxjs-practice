import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { debounceTime, distinctUntilChanged, startWith, tap, delay, map, concatMap, switchMap, 
  withLatestFrom, concatAll, shareReplay, throttle } from 'rxjs/operators';
import { merge, fromEvent, Observable, concat, interval } from 'rxjs';

import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';


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

  constructor(private route: ActivatedRoute) {  }

  ngOnInit() {

    this.courseId = this.route.snapshot.params['id'];

    this.course$ = (createHttpObservable(`/api/courses/${this.courseId}`) as Observable<Course>);
    this.lessons$ = this.loadLessons();
  }

  ngAfterViewInit() {
    // const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
    //   .pipe(
    //     map(event => event.target.value),
    //     debounceTime(500),
    //     distinctUntilChanged(),
    //     switchMap(searchTerm => this.loadLessons(searchTerm))
    //   );

    // const initialLessons$ = this.loadLessons();

    // this.lessons$ = concat(initialLessons$, searchLessons$);


    this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''), // initial searchTerm is ''
        debounceTime(500),
        // throttle(() => interval(500)),
        distinctUntilChanged(),
        switchMap(searchTerm => this.loadLessons(searchTerm))
      );
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(resp => resp['payload'])
      );
  }

}
