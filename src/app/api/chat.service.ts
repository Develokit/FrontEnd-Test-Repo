// 해당 service는 녹음한 음성의 text를 받아와 chattutor 화면에서 보여지게 하기 위한 service입니다.
// 쓰레드 생성 구현 완료 + 정상 작동 확인 완료
// 채팅 주고 받는 로직 구현 완료 + 정상 작동 확인 완료
// 현재 issue : 지피티가 머리가 멍청한건지 우리가 멍청한건지(일단 나는 지피티가 멍청한거 같은데 에휴)
// 현재 issue : 파일 전송을 되는데 먼가 열람이 안됨(추측은 backend 측 문제. 일단 해결 중)

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import axios from 'axios';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  // audio.service 주입

  endpoint: string = 'https://f430-122-202-203-67.ngrok-free.app/'; // API URL
  isFirst: boolean = true;
  threadId: string = '';
  selectedFile: File | null = null;
  voicebool: boolean = false;
  byteString: string = '';

  // 상태 변화 확인을 위해 꼭 필요한 코드!
  private changeByteString = new Subject<string>();

  constructor(private sharedService: SharedService) {}

  getAssistantId(): string {
    return this.sharedService.getId(); // 직접 호출
  }

  setbtyeString(value: string) {
    this.byteString = value;
    this.changeByteString.next(value);
  }

  getbtyeString() {
    return this.byteString;
  }

  // 다른 컴포넌트에서 변화를 추적하기 위해 구독을 하는 함수(일단 여기에서는 안ㅆ므)
  onChangeByteString() {
    return this.changeByteString.asObservable();
  }

  public messagesSource = new BehaviorSubject<
    { sender: string; text: string }[]
  >([]);
  currentMessages = this.messagesSource.asObservable();

  addFile(componentSelectedfile: File) {
    this.selectedFile = componentSelectedfile;
  }

  async addMessage(message: { sender: string; text: string }) {
    if (this.isFirst) {
      //여기에서 await이 걸리는거! try 안에서 실행되는 애들이 완료될 때까지 기다리는 것이므로 성공하지 않을까..?
      try {
        const response = await this.createThread();
        console.log('쓰레드 아이디 : ' + response.data.id);
        this.threadId = response.data.id;
        this.isFirst = false;
        console.log('fin');
      } catch (error) {
        console.error('에러:', error);
      }
    }

    const currentMessages = this.messagesSource.getValue();
    this.messagesSource.next([...currentMessages, message]);

    // File 존재 여부에 따라 조건을 걸고 파일이 존재한다면 파일을 서버에 전송하고 답변을 받아오는 로직을 추가해야 함

    try {
      let response;
      let newMessage;
      const assistantId = this.getAssistantId();
      this.sharedService.isLoading = true;

      console.log('sendfileprompt 실행 전 : ' + this.selectedFile?.name);
      if (this.selectedFile != null) {
        response = await this.sendFilePrompt(
          message.text,
          assistantId,
          this.voicebool,
          this.selectedFile
        );
        console.log('sendfileprompt 동기 실행 : ' + this.selectedFile.name);
        this.selectedFile = null;
      } else {
        response = await this.sendPrompt(
          message.text,
          assistantId,
          this.voicebool
        );
      }
      if (this.voicebool == false) {
        newMessage = { sender: 'AI', text: response.data.answer };
      } else {
        newMessage = { sender: 'AI', text: response.data.chatDto.answer };
        // 동기처리 하는 부분
        this.setbtyeString(response.data.speech);
      }
      const currentMessages = this.messagesSource.getValue();
      this.messagesSource.next([...currentMessages, newMessage]);
    } catch (error) {
      console.error('에러:', error);
      this.sharedService.isLoading = false;
    }
    this.sharedService.isLoading = false;
    console.log('addmessage 종료');
  }

  compareVoiceBool(isVoice: boolean) {
    this.voicebool = isVoice;
    console.log(this.voicebool);
  }

  createThread() {
    const apiUrl = `${this.endpoint}assistants/threads`;
    const config = {
      headers: {
        'content-type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    return axios.post(apiUrl, config);
  }

  deleteThread() {
    //api호출을 통한 쓰레드 삭제
    const apiUrl = `${this.endpoint}assistants/threads/${this.threadId}`;
    const config = {
      headers: {
        'content-type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    //프론트 측 쓰레드 아이디 삭제
    this.threadId = '';
    console.log('쓰레드 아이디 삭제 완료');
    return axios.delete(apiUrl, config);
  }

  sendPrompt(content: string, assistantId: string, isVoice: boolean) {
    const apiUrl = `${this.endpoint}assistants/${this.threadId}/chat`;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    const formData = new FormData();
    formData.append('content', content);
    formData.append('assistantId', assistantId);
    formData.append('isVoice', this.voicebool.toString());
    return axios.post(apiUrl, formData, config);
  }

  sendFilePrompt(
    content: string,
    assistantId: string,
    isVoice: boolean,
    file: File
  ) {
    const apiUrl = `${
      this.endpoint
    }assistants/${this.sharedService.getId()}/chat`;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'ngrok-skip-browser-warning': '69420',
      },
    };
    const formData = new FormData();
    formData.append('content', content);
    formData.append('assistantId', assistantId);
    formData.append('isVoice', this.voicebool.toString());
    formData.append('file', file, file.name);
    console.log('sendfileprompt 실행 : ' + file.name);
    return axios.post(apiUrl, formData, config);
  }
}
