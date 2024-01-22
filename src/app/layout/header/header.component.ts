import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, CreateComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  onClick() {
    console.log('clicked');
  }

  constructor(private router: Router) {}

  // this.router.navigate([path]); 코드 추가 시 탭 제대로 작동하지 않음
  // 아직 해결 방법 찾지 못함
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
