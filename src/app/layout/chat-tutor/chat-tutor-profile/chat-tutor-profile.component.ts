import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatTutorProfileService } from '../../../api/chat-tutor-profile.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-chat-tutor-profile',
  standalone: true,
  templateUrl: './chat-tutor-profile.component.html',
  styleUrl: './chat-tutor-profile.component.scss',
  imports: [NgIf],
})
export class ChatTutorProfileComponent {
  constructor(private chatprofileService: ChatTutorProfileService) {}

  name: string = '';
  imgFile: string = '';
  description: string = '';

  ngOnInit() {
    this.chatprofileService
      .fetchProfile()
      .then((response) => {
        this.name = response.data.name; // response.data 객체에서 name 속성을 추출하여 컴포넌트의 name 변수에 할당
        this.imgFile = response.data.imgFile;
        this.description = response.data.description;
      })
      .catch((error) => {
        console.error('에러 메시지 : ' + error);
      });
  }
}
