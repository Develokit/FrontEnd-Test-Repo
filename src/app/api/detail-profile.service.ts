import { Injectable } from '@angular/core';
import axios from 'axios';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class DetailProfileService {
  constructor(private sharedService: SharedService) {}

  getAssistantId(): string {
    return this.sharedService.getId(); // 직접 호출
  }
  endpoint: string = 'https://f430-122-202-203-67.ngrok-free.app/'; // API URL

  fetchProfile() {
    const apiUrl = `${
      this.endpoint
    }assistants/${this.sharedService.getId()}/info`;
    const config = {
      headers: {
        'content-type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    return axios.get(apiUrl, config);
  }
}
