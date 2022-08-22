import { Observable, Observer } from 'rxjs';


export function createHttpObservable(url: string) {
  return new Observable((observer: Observer<Object>) => {

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { signal })
      .then(resp => {
        return resp.json();
      })
      .then(body => {
        observer.next(body);
        observer.complete();
      })
      .catch(err => {
        observer.error(err);
      });

    return () => controller.abort();
  });
}