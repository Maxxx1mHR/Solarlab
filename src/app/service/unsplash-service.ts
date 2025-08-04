import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Photo, PhotosResponse, SearchPhotosResponse } from '../types/photo';
import { parseLinkHeader } from '../utils/parsers';

@Injectable({
  providedIn: 'root',
})
export class UnsplashService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiBase;
  private searchUrl = environment.apiSearch;

  getPhotos(
    page: number = 1,
    per_page: number = 10
  ): Observable<PhotosResponse> {
    return this.http
      .get<Photo[]>(this.baseUrl, {
        observe: 'response',
        params: {
          page: page.toString(),
          per_page: per_page.toString(),
        },
      })
      .pipe(
        retry(1),
        map((resp: HttpResponse<Photo[]>) => {
          let responseMap;
          const linkHeader = resp.headers.get('Link') || '';
          const page = parseLinkHeader(linkHeader);
          responseMap = {
            data: resp.body ?? [],
            page: page['last'] ?? 0,
          };

          return responseMap ?? [];
        }),
        catchError(this.handleError)
      );
  }

  searchPhotos(
    page: number = 1,
    per_page: number = 10,
    query: string = 'nature'
  ): Observable<PhotosResponse> {
    return this.http
      .get<SearchPhotosResponse>(this.searchUrl, {
        observe: 'response',
        params: {
          page: page.toString(),
          per_page: per_page.toString(),
          query,
        },
      })
      .pipe(
        retry(1),
        map((resp: HttpResponse<SearchPhotosResponse>) => {
          let responseMap;
          responseMap = {
            data: resp.body?.results ?? [],
            page: resp.body?.total_pages ?? 0,
          };

          return responseMap ?? [];
        }),
        catchError(this.handleError)
      );
  }

  private handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      console.error('Client error:', error.error.message);
    } else {
      console.error(`Server error ${error.status}:`, error.error);
    }
    return throwError(
      () => new Error('Что-то пошло не так; попробуйте позже.')
    );
  };
}
