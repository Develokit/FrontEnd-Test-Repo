import { Component, OnInit } from '@angular/core';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { NgFor, NgIf } from '@angular/common';
import { DetailProfileService } from '../../api/detail-profile.service';
import { SharedService } from '../../api/shared.service';
import { Router } from '@angular/router';

interface JsonData {
  [key: string]: string;
}

@Component({
  selector: 'app-detail',
  standalone: true,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  imports: [SubHeaderComponent, NgIf, NgFor],
})
export class DetailComponent {
  constructor(
    private detailprofileService: DetailProfileService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  name: string = '';
  img: string = '';
  description: string = '';
  personality: string = '';
  speechLevel: string = '';
  voice: string = '';

  // 튜터 성향에 따른 선택지에 따라 한국어 text 할당
  // ex. if(ps == kindness) print(친절함)
  // personality(성격)에 들어올 수 있는 값 : Kindness, Seriousness, Humorousness
  // speechLevel(존대 여부)에 들어올 수 있는 값 : Formal, Informal
  // voice(보이스 성별)에 들어올 수 있는 값 : Female, Male
  jsonData: JsonData = {
    Kindness: '상냥',
    Seriousness: '진지',
    Humorousness: '유머러스',
    Formal: '존대',
    Informal: '반말',
    Female: '여성',
    Male: '남성',
  };

  ngOnInit() {
    this.detailprofileService
      .fetchProfile()
      .then((response) => {
        this.name = response.data.name; // response.data 객체에서 name 속성을 추출하여 컴포넌트의 name 변수에 할당
        this.img = response.data.img;
        this.description = response.data.description;
        this.personality =
          this.jsonData[response.data.personality as keyof JsonData];
        this.speechLevel =
          this.jsonData[response.data.speechLevel as keyof JsonData];
        this.voice = this.jsonData[response.data.voice as keyof JsonData];
      })
      .catch((error) => {
        console.error('에러 메시지 : ' + error);
      });
  }

  getAssistantId(): string {
    return this.sharedService.getId(); // 직접 호출
  }

  navigateToUpdate() {
    const assistantId = this.getAssistantId();
    this.router.navigateByUrl('update-tutor', {
      state: { id: { assistantId } },
    });
    console.log('id : ' + { assistantId });
  }
}
