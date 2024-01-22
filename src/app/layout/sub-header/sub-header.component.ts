import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-header',
  standalone: true,
  templateUrl: './sub-header.component.html',
  imports: [MatTabsModule],
})
export class SubHeaderComponent {
  constructor(private router: Router) {}

  // 함수 issue로 인해 확인을 위해 console.log 코드 추가
  onTabChanged(index: number) {
    console.log('change');
    if (index === 0) {
      // 첫 번째 탭(상세정보)이 클릭됐을 때
      this.navigateTo('detail');
      console.log('detail');
    } else if (index === 1) {
      // 두 번째 탭(질의응답)이 클릭됐을 때
      this.navigateTo('chat-tutor');
      console.log('chat');
    }
  }

  // this.router.navigate([path]); 코드 추가 시 탭 제대로 작동하지 않음
  // 아직 해결 방법 찾지 못함
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
