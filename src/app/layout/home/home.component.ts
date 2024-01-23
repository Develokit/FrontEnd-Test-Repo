import { Component, HostListener, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import {NgIf, NgOptimizedImage} from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HomeService } from '../../api/home-service';
import { SharedService } from '../../api/shared.service';

export interface Tile {
  name: string;
  img: string;
  url: string;
  id: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule, NgOptimizedImage, RouterLink, RouterOutlet, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  tiles: any[] = [];
  cols: number | undefined;
  protected isLoading : boolean = false;

  @HostListener('window:resize')
  onResize() {
    // 창 너비에 따라 cols 값을 조정
    if (window.innerWidth > 1200) {
      this.cols = 8;
    } else if (window.innerWidth > 800) {
      this.cols = 6;
    } else if (window.innerWidth > 550) {
      this.cols = 4;
    } else {
      this.cols = 3;
    }
  }

  constructor(
    private router: Router,
    private homeService: HomeService,
    private sharedService: SharedService
  ) {
    this.onResize();
  }

  ngOnInit() {
    this.isLoading = true;
    this.homeService
      .fetchHome()
      .then((response) => {
        this.tiles = response.data.map((item: any) => ({
          cols: item.cols || 1,
          rows: item.rows || 1,
          name: item.name,
          img: item.img,
          url: item.url,
          id: item.assistantId,
        }));
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('에러 메시지 : ' + error);
        this.isLoading = false;
      });
  }

  columns = 3;
  private intervalId: any;

  onAddTileClick(): void {
    this.router.navigateByUrl('create-tutor');
    console.log('튜터 생성 페이지로 이동');
  }

  onTileClick(tile: Tile): void {
    this.sharedService.setId(tile.id); // 클릭된 타일의 ID를 저장
    this.router.navigateByUrl('detail', { state: { id: tile.id } });
  }

  // 이미지가 있는 타일만 필터링
  get filteredTiles(): Tile[] {
    return this.tiles.filter((tile) => tile.img !== '');
  }
}
