import { Injectable } from '@angular/core';
import axios from 'axios';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(private sharedService: SharedService) {}

  endpoint: string = 'https://f430-122-202-203-67.ngrok-free.app/';

  getAssistantId(): string {
    return this.sharedService.getId(); // 직접 호출
  }

  deleteTutor() {
    const assistantId = this.getAssistantId();
    const apiUrl = `${this.endpoint}assistants/${assistantId}`;
    const config = { headers: { 'ngrok-skip-browser-warning': '69420' } };
    return axios.delete(apiUrl, config);
  }

  enterUpdateTutor() {
    const assistantId = this.getAssistantId();

    const apiUrl = `${this.endpoint}assistants/${assistantId}/info/page`;
    const config = {
      headers: {
        'content-type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    return axios.get(apiUrl, config);
  }

  updateImage(img: File) {
    const assistantId = this.getAssistantId();
    const apiUrl = `${this.endpoint}assistants/${assistantId}/info/page/image`;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    const formData = new FormData();

    formData.append('imgFile', img, img.name);

    return axios.put(apiUrl, formData, config);
  }

  updateTutorDual(
    instruction: string,
    name: string,
    description: string,
    voice: string,
    personality: string,
    speechLevel: string,
    file1: File,
    file2: File
  ) {
    const assistantId = this.getAssistantId();
    const apiUrl = `${this.endpoint}assistants/${assistantId}/info/page`;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    const formData = new FormData();
    formData.append('instruction', instruction);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('voice', voice);
    formData.append('personality', personality);
    formData.append('speechLevel', speechLevel);
    formData.append('file1', file1, file1.name);
    formData.append('file2', file2, file2.name);

    return axios.put(apiUrl, formData, config);
  }

  updateTutorOne(
    instruction: string,
    name: string,
    description: string,
    voice: string,
    personality: string,
    speechLevel: string,
    file1: File
  ) {
    const assistantId = this.getAssistantId();
    const apiUrl = `${this.endpoint}assistants/${assistantId}/info/page`;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    const formData = new FormData();
    formData.append('instruction', instruction);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('voice', voice);
    formData.append('personality', personality);
    formData.append('speechLevel', speechLevel);
    formData.append('file1', file1, file1.name);

    return axios.put(apiUrl, formData, config);
  }

  updateTutorNone(
    instruction: string,
    name: string,
    description: string,
    voice: string,
    personality: string,
    speechLevel: string
  ) {
    const assistantId = this.getAssistantId();
    const apiUrl = `${this.endpoint}assistants/${assistantId}/info/page`;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    const formData = new FormData();
    formData.append('instruction', instruction);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('voice', voice);
    formData.append('personality', personality);
    formData.append('speechLevel', speechLevel);

    return axios.put(apiUrl, formData, config);
  }
}
