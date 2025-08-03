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
  photos!: PhotosResponse;

  test = '';
  testFn!: (value: string) => void;

  constructor(private api: UnsplashService) {
    this.testFn = this.debounce(this.onInput, 2000);
  }

  ngOnInit(): void {
    this.api
      .getPhotos()
      .subscribe({ next: (data: PhotosResponse) => (this.photos = data) });

    console.log('ph', this.photos);
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

  onInput(value: string): void {
    console.log('test через ngModel и (input):', value);
  }
}
