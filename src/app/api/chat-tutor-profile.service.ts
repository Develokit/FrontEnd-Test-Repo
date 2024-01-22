import { Injectable } from '@angular/core';
import axios from 'axios';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class ChatTutorProfileService {
  constructor(private sharedService: SharedService) {}

  getAssistantId(): string {
    return this.sharedService.getId(); // 직접 호출
  }
  endpoint: string = 'https://f430-122-202-203-67.ngrok-free.app/'; // API URL

  fetchProfile() {
    const assistantId = this.getAssistantId();
    const apiUrl = `${this.endpoint}assistants/${assistantId}/chat`;
    const config = {
      headers: {
        'content-type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    console.log('assistandID 테스트 : ' + assistantId);
    return axios.get(apiUrl, config);
  }
}
