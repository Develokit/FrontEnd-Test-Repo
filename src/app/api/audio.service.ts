// 사용자가 voice로 녹음 후 text로 변환된 질문을 ai가 받고 다시 audio로 출력시키기 위한 service 파일입니다.

import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private apiUrl : string = environment.endPoint + "/audio/speech";

  constructor() {}

  createAudioUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  async postData(data: any): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
