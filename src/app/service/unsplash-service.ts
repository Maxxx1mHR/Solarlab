import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

export interface Photo {
  id: string;
  slug: string;
  alternative_slugs: {
    en: string;
    es: string;
    ja: string;
    fr: string;
    it: string;
    ko: string;
    de: string;
    pt: string;
    id: string;
  };
  created_at: string;
  updated_at: string;
  promoted_at: string | null;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string;
  alt_description: string | null;
  breadcrumbs: Array<any>;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
    small_s3: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  likes: number;
  liked_by_user: boolean;
  current_user_collections: Array<any>;
  sponsorship: {
    impression_urls: Array<any>;
    tagline: string;
    tagline_url: string;
    sponsor: {
      id: string;
      updated_at: string;
      username: string;
      name: string;
      first_name: string;
      last_name: string | null;
      twitter_username: string | null;
      portfolio_url: string;
      bio: string;
      location: string | null;
      links: {
        self: string;
        html: string;
        photos: string;
        likes: string;
        portfolio: string;
      };
      profile_image: {
        small: string;
        medium: string;
        large: string;
      };
      instagram_username: string;
      total_collections: number;
      total_likes: number;
      total_photos: number;
      total_promoted_photos: number;
      total_illustrations: number;
      total_promoted_illustrations: number;
      accepted_tos: boolean;
      for_hire: boolean;
      social: {
        instagram_username: string;
        portfolio_url: string;
        twitter_username: string | null;
        paypal_email: string | null;
      };
    };
  };
  topic_submissions: Record<string, string>;
  asset_type: string;
  user: {
    id: string;
    updated_at: string;
    username: string;
    name: string;
    first_name: string;
    last_name: string | null;
    twitter_username: null;
    portfolio_url: string;
    bio: string;
    location: string | null;
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
      portfolio: string;
    };
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    instagram_username: string;
    total_collections: number;
    total_likes: number;
    total_photos: number;
    total_promoted_photos: number;
    total_illustrations: number;
    total_promoted_illustrations: number;
    accepted_tos: boolean;
    for_hire: boolean;
    social: {
      instagram_username: string;
      portfolio_url: string;
      twitter_username: string | null;
      paypal_email: string | null;
    };
  };
}

// export interface PhotosResponse {}

export interface PhotosResponse {
  data: Photo[];
  page: number;
}

export interface SearchPhotosResponse {
  total: number;
  total_pages: number;
  results: Photo[];
}

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
          console.log('test', resp);
          console.log('linkHeader', linkHeader);

          const page = parseLinkHeader(linkHeader);
          console.log('page', page);
          console.log('resp', resp.body);

          responseMap = {
            data: resp.body ?? [],
            page: page['last'] ?? 0,
          };

          return responseMap ?? [];
        })
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
          // const linkHeader = resp.headers.get('Link') || '';
          // console.log('test', resp);
          // console.log('linkHeader', linkHeader);

          // const page = parseLinkHeader(linkHeader);
          // console.log('page', page);
          // console.log('resp', resp.body);

          responseMap = {
            data: resp.body?.results ?? [],
            page: resp.body?.total_pages ?? 0,
          };

          return responseMap ?? [];
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Client error:', error.error.message);
    } else {
      console.error(`Server error ${error.status}:`, error.error);
    }
    return throwError(
      () => new Error('Что-то пошло не так; попробуйте позже.')
    );
  }
}

function parseLinkHeader(header: string): Record<string, number> {
  const result: Record<string, number> = {};
  if (!header) return result;

  const parts = header.split(',');
  parts.forEach((part) => {
    const match = /<([^>]+)>;\s*rel="([^"]+)"/.exec(part.trim());
    if (match) {
      const url = match[1];
      const rel = match[2];
      try {
        const params = new URL(url).searchParams;
        const page = params.get('page');
        if (page) {
          result[rel] = Number(page);
        }
      } catch (e) {
        console.log('e', e);
      }
    }
  });

  return result;
}
