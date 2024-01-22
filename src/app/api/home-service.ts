import { Injectable } from '@angular/core';
import axios from 'axios';
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  endpoint: string = 'https://f430-122-202-203-67.ngrok-free.app';
  fetchHome() {
    const apiUrl = `${this.endpoint}/`; // 이것은 작은 따옴표가 아니야
    const config = {
      headers: {
        'content-type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    }; // 사람한테 점 찍기
    return axios.get(apiUrl, config);
  }
}
