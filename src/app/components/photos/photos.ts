import { Component } from '@angular/core';
import { UnsplashService } from '../../service/unsplash-service';
import { finalize, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzInputModule } from 'ng-zorro-antd/input';
import { debounce } from '../../utils/debounce';
import { PhotosResponse } from '../../types/photo';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-photos',
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzPaginationModule,
    NzLayoutModule,
    NzInputModule,
    NzSpinModule,
  ],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos {
  photos: PhotosResponse | null = null;

  searchQuery = '';
  handleInput!: (value: string) => void;

  page = 1;
  per_page = 10;
  isLoading = false;

  constructor(private api: UnsplashService) {
    this.handleInput = debounce(this.onInput, 280);
  }

  totalItems() {
    if (!this.photos) return 0;
    return Math.min(this.photos.page, 1000);
  }

  ngOnInit(): void {
    this.loadPhotos();
  }

  private loadPhotos() {
    this.isLoading = true;

    const request = this.searchQuery.trim()
      ? this.api.searchPhotos(this.page, this.per_page, this.searchQuery)
      : this.api.getPhotos(this.page, this.per_page);

    request.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: (data: PhotosResponse) => {
        this.photos = data;
      },
      error: (error) => console.log('error', error),
    });
  }

  onInput = (): void => {
    this.page = 1;
    this.loadPhotos();
  };

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.loadPhotos();
  }

  changePageSize(pageSize: number) {
    this.page = 1;
    this.per_page = pageSize;
    this.loadPhotos();
  }
}
