import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection, importProvidersFrom,
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
import { environment } from './environments/environment';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { NZ_I18N, ru_RU, en_US, NzI18nService, provideNzI18n } from 'ng-zorro-antd/i18n';
const ngZorroConfig: NzConfig = {};
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(ru);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const cloned = req.clone({
    setHeaders: {
      Authorization: `Authorization Client-ID ${environment.apiKey}`,
    },
  });
  return next(cloned);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNzConfig(ngZorroConfig),
    { provide: NZ_I18N, useValue: ru_RU },
    provideAnimations(), provideNzI18n(ru_RU), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient(),
  ],
};
