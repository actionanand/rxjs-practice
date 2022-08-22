import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { concat, interval, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // concat observable; output: 1, 2, 3, 4, 5, 6, 7, 8, 9
    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6);
    const source3$ = of(7, 8, 9);

    const concatResult$ = concat(source1$, source2$, source3$);

    concatResult$.subscribe(val => console.log(val));


    // merge observable; output: 0, 0, 1, 10, 2, 20, 3, 30 ...
    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(map(val => val * 10));
    const intervalResult$ = merge(interval1$, interval2$);

    const intervalSub = intervalResult$.subscribe(console.log);

    setTimeout(() => intervalSub.unsubscribe(), 5000);
    
  }

}
