import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { interval } from 'rxjs';
import { map, take, delay, withLatestFrom, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      padding: 64px 32px;
      display: block;
    }
  `]
})
export class AppComponent {
  timer = 0;

  delayedProgress$ = this.loader.progress$.pipe(
    delay(1000),
    withLatestFrom(this.loader.progress$),
    map(v => v[1]),
  );

  constructor(
    private httpClient: HttpClient,
    public loader: LoadingBarService,
  ) { }

  get count() {
    // warning: do not use `state`, it's used here for demo purpose only
    return this.loader['state$']['requests'] || 0;
  }

  startHttpClientRequest() {
    this.httpClient.get('https://jsonplaceholder.typicode.com/users').subscribe();
  }

  start() {
    this.loader.start(10);
  }

  set() {
    this.loader.set(50);
  }

  increment() {
    this.loader.increment(10);
  }

  complete() {
    this.loader.complete();
  }

  stop() {
    this.loader.stop();
  }

  startTimer() {
    interval(1000).pipe(
      take(3),
      tap(value => { this.timer = value + 1; }),
      finalize(() => this.loader.complete()),
    ).subscribe();

    // We're sure that subscription has been made, we can start loading bar service
    this.loader.start();
  }
}
