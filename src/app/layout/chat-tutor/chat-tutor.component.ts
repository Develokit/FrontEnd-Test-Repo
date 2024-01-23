import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ChatTutorProfileComponent } from './chat-tutor-profile/chat-tutor-profile.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VoiceComponent } from '../voice/voice.component';
import { ChatService } from '../../api/chat.service';
import { HttpClientModule } from '@angular/common/http';
import { ChatTutorProfileService } from '../../api/chat-tutor-profile.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedService } from '../../api/shared.service';

declare var SpeechRecognition: any;
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-chat-tutor',
  standalone: true,
  templateUrl: './chat-tutor.component.html',
  imports: [
    SubHeaderComponent,
    ChatTutorProfileComponent,
    FormsModule,
    NgFor,
    NgIf,
    HttpClientModule,
    MatProgressSpinnerModule,
  ],
})
export class ChatTutorComponent implements OnInit, OnDestroy {
  name: string = ''; // 튜터 이름
  imgFile: string = ''; // 튜터 이미지
  description: string = ''; // 튜터 소개

  selectedImageString: string | null = null;
  selectedImageFile: File | null = null;
  selectedFile: File | null = null;
  fileName = ''; // 파일 이름

  newMessage: string = '';
  text: string = ``;
  temptext: string = '';

  private recognition: any; // SpeechRecognition의 타입을 any로 설정
  isRecording: boolean = false;
  protected isLoading : boolean = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public chatService: ChatService,
    private chatprofileService: ChatTutorProfileService,
    private sharedService: SharedService
  ) {
    if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
    } else if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
    } else {
      console.error('브라우저가 SpeechRecognition을 지원하지 않습니다.');
      this.recognition = null;
    }

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.lang = 'ko-KR';
      this.recognition.onstart = () =>
        console.log('음성 인식이 시작되었습니다.');
      this.recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        this.temptext = transcript;
        // 여기 부분이 chatService로 text로 변환된 voice를 보내는 부분입니다.
      };
    }
  }

  // 채팅창에 입력한 text가 출력되도록
  // 텍스트 입력 컴포넌트
  sendMessage() {
    this.isLoading = true;
    if (this.newMessage.trim() !== '') {
      // 메시지와 함께 파일도 전송하는 경우
      if (this.selectedFile != null) {
        this.chatService.addFile(this.selectedFile);
        this.chatService.addMessage({
          sender: '사용자',
          text: this.newMessage})
          .then(response=>{
            this.isLoading = false;
          })
          .catch(error=>{
            console.error("error : " + error);
            this.isLoading = false;
          })
        this.selectedFile = null;
      } else {
        // 파일 없이 메시지만 전송하는 경우
        this.chatService.addMessage({
          sender: '사용자',
          text: `${this.newMessage}`})
          .then(response=>{
            this.isLoading = false;
          })
          .catch(error=>{
            console.error("error : " + error);
            this.isLoading = false;
          })
      }
      this.newMessage = ``;
    }
  }

  // 채팅 메시지 출력 컴포넌트
  messages: { sender: string; text: string }[] = [];

  ngOnInit() {
    this.chatService.currentMessages.subscribe((messages) => {
      this.messages = messages;
    });
    this.isLoading = true;
    this.chatprofileService
      .fetchProfile()
      .then((response) => {
        this.sharedService.setTutorName(response.data.name);
        this.name = response.data.name; // response.data 객체에서 name 속성을 추출하여 컴포넌트의 name 변수에 할당
        this.imgFile = response.data.imgFile;
        this.description = response.data.description;
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('에러 메시지 : ' + error);
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    if (this.chatService.threadId !== '') {
      this.chatService.deleteThread();
    }
    this.messages = [];
    this.messages.length = 0;

    // chatService에서 넘어오는 애들 초기화
    this.chatService.isFirst = true;
    this.chatService.messagesSource.next([]);

    console.log('화면에서 벗어나서 destroy실행 됨');
  }

  // 이 아래는 이미지 및 파일 선택 및 삭제 관련 함수 설정

  onImageSelect(event: any) {
    this.selectedImageFile = event.target.files[0];
    this.selectedFile = null;
  }

  onFileSelect(event: any) {
    this.selectedImageFile = null;
    this.selectedFile = event.target.files[0];
    // if (file) {
    //   // 파일 선택 시 이미지 선택 초기화
    //   this.selectedFile = file;
    // }
  }

  removeSelectedImage() {
    this.selectedImageFile = null;
  }

  removeSelectedFile() {
    this.selectedFile = null;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  // 음성으로 채팅 입력
  toggleRecord(): void {
    this.isRecording = !this.isRecording;
    if (this.isRecording === true) {
      this.startListening();
    } else if (this.isRecording === false) {
      this.stopListening();
      console.log(this.temptext);
      // 변환된 text를 채팅창에서 자유롭게 수정할 수 있도록 표시!
      this.newMessage = this.temptext;
    }
  }

  // 녹음 시작
  startListening(): void {
    if (this.recognition) {
      this.recognition.start();
      console.log('음성 인식이 시작되었습니다.');
    }
  }

  // 녹음 중단
  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
      console.log('음성 인식이 중단되었습니다.');
    }
  }

  // 모달 설정
  openDialog(): void {
    const dialogRef = this.dialog.open(VoiceComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('모달이 닫혔습니다.');
    });
  }
}
