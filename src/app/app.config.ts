import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const token = localStorage.getItem('jwt');
  const cloned = req.clone({
    setHeaders: {
      Authorization: `Authorization Client-ID FnieF2cE1XmcUbwwVsk1MkINfQqxZhyEoTMrJs7i59s`,
    },
  });
  return next(cloned);
  // return next(req);
  // const reqWithHeader = req.clone({
  //   headers: req.headers.set(
  //     'Authorization',
  //     'Client-ID FnieF2cE1XmcUbwwVsk1MkINfQqxZhyEoTMrJs7i59s'
  //   ),
  // });
  // return next(reqWithHeader);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // provideHttpClient(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
