import { Component } from '@angular/core';
import {
  PhotosResponse,
  UnsplashService,
} from '../../service/unsplash-service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-photos',
  imports: [CommonModule, FormsModule],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos {
  // photos!: Observable<Photo[]>;
  photos: PhotosResponse | null = null;

  searchQuery = '';
  testFn!: (value: string) => void;

  page = 1;
  per_page = 10;

  constructor(private api: UnsplashService) {
    this.testFn = this.debounce(this.onInput, 200);
  }

  ngOnInit(): void {
    this.loadPhotos();
    // if (this.test.trim()) {
    //   this.searchPhotos();
    // } else {
    //   this.loadPhotos();
    // }
  }

  private loadPhotos() {
    this.api.getPhotos(this.page, this.per_page).subscribe({
      next: (data: PhotosResponse) => {
        this.photos = data;
      },
    });
  }
  private searchPhotos() {
    console.log('!!!!', this.searchQuery);
    this.api
      .searchPhotos(this.page, this.per_page, this.searchQuery)
      .subscribe({
        next: (data: PhotosResponse) => {
          this.photos = data;
        },
      });
  }

  debounce = <T extends string[]>(fn: (...args: T) => void, ms: number) => {
    let timeout: ReturnType<typeof setTimeout>;

    return function (...args: T) {
      const fnCall = () => {
        fn(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, ms);
    };
  };

  onInput = (value: string): void => {
    // console.log('test через ngModel и (input):', value);
    // console.log('searchQuery,', this.searchQuery);
    this.searchQuery.trim() ? this.searchPhotos() : this.loadPhotos();
  };

  nextPage() {
    this.page = this.page + 1;
    this.loadPhotos();
    this.searchQuery.trim() ? this.searchPhotos() : this.loadPhotos();
  }

  prevPage() {
    this.page = this.page - 1;
    this.loadPhotos();
    this.searchQuery.trim() ? this.searchPhotos() : this.loadPhotos();
  }
}
