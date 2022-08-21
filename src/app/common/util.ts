import { Observable, Observer } from 'rxjs';


export function createHttpObservable(url: string) {
  return new Observable((observer: Observer<Object>) => {
    fetch(url)
      .then(resp => {
        return resp.json();
      })
      .then(body => {
        observer.next(body);
        observer.complete();
      })
      .catch(err => {
        observer.error(err);
      })
  });
}