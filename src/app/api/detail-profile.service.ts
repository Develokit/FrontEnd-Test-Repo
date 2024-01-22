import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import axios from 'axios';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class DetailProfileService {
  constructor(private sharedService: SharedService) {}
  endpoint: string = environment.endPoint + "/";

  getAssistantId(): string {
    return this.sharedService.getId(); // 직접 호출
  }

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
