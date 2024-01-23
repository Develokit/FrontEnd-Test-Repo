import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class CreateService {
  endpoint: string = environment.endPoint;

  generateInstruction(beforeInstruction : string){
    const apiUrl : string = `${this.endpoint}/assistants/gpt`;
    const config = {
      headers: {
        'content-type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    const data = {"instruction" : beforeInstruction};
    return axios.post(apiUrl, data, config);
  }


  // 파일 두 개를 모두 업로드
  handleDualFiles(
    img: File,
    instruction: string,
    name: string,
    description: string,
    voice: string,
    personality: string,
    speechLevel: string,
    file1: File,
    file2: File
  ) {
    const apiUrl = `${this.endpoint}/assistants/gpt4`; //TODO : 후에 바꾸기
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    const formData = new FormData();
    formData.append('imgFile', img, img.name);
    formData.append('instruction', instruction);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('voice', voice);
    formData.append('personality', personality);
    formData.append('speechLevel', speechLevel);
    formData.append('file1', file1, file1.name);
    formData.append('file2', file2, file2.name);

    return axios.post(apiUrl, formData, config);
  }

  // 파일 하나만 업로드
  handleOneFile(
    img: File,
    instruction: string,
    name: string,
    description: string,
    voice: string,
    personality: string,
    speechLevel: string,
    file1: File
  ) {
    const apiUrl = `${this.endpoint}/assistants/gpt4`;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    const formData = new FormData();

    formData.append('imgFile', img, img.name);
    formData.append('instruction', instruction);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('voice', voice);
    formData.append('personality', personality);
    formData.append('speechLevel', speechLevel);
    formData.append('file1', file1, file1.name);

    return axios.post(apiUrl, formData, config);
  }

  // 파일 없이 업로드
  handleNoFile(
    img: File,
    instruction: string,
    name: string,
    description: string,
    voice: string,
    personality: string,
    speechLevel: string
  ) {
    const apiUrl = `${this.endpoint}/assistants/gpt4`;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    const formData = new FormData();
    formData.append('imgFile', img, img.name);
    formData.append('instruction', instruction);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('voice', voice);
    formData.append('personality', personality);
    formData.append('speechLevel', speechLevel);

    return axios.post(apiUrl, formData, config);
  }
}
