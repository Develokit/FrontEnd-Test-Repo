import {NgIf, NgOptimizedImage} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChatService } from '../../api/chat.service';
import { AudioService } from '../../api/audio.service';

declare var SpeechRecognition: any;
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-voice',
  standalone: true,
  imports: [NgIf, NgOptimizedImage],
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss'],
})
export class VoiceComponent implements OnInit {
  audioUrl: string | null = null;

  private recognition: any; // SpeechRecognition의 타입을 any로 설정
  isListening = false;
  isCheck = false;
  text = '음성으로 튜터와 대화합니다. \n버튼을 눌러 음성을 입력해주세요.';
  isPlaying: boolean = false;
  protected isLoading : boolean = false;
  // 음성 인식 결과 처리 컴포넌트
  processVoiceToText(voiceText: string) {
    this.isLoading = true;
    this.chatService.addMessage({ sender: '음성 인식', text: voiceText })
      .then(response=>{
        this.isLoading = false;
      })
      .catch(error=>{
        console.error("error : " + error);
        this.isLoading = false;
      })
  }

  sendVoiceBool() {
    this.chatService.compareVoiceBool(this.isCheck);
  }

  // 음성을 녹음하고 text로 변환하는 코드
  constructor(
    public dialogRef: MatDialogRef<VoiceComponent>,
    public chatService: ChatService,
    private audioService: AudioService
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
        this.text = transcript;
        // 여기 부분이 chatService로 text로 변환된 voice를 보내는 부분입니다.
      };
    }
  }

  ngOnInit(): void {
    this.chatService.onChangeByteString().subscribe((value) => {
      //음성 출력하는 부분 해야함. 일단 BASE64를 받아서 mp3로 변환하는 코드를 작성해야함.
      this.getAudio();
    });
  }

  // 토글값 입력 받고 상태 변화에 따라 녹음 시작 및 중단
  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying === true) {
      this.startListening();
    } else if (this.isPlaying === false) {
      this.stopListening();
    }
  }

  // 녹음 시작
  startListening(): void {
    if (this.recognition) {
      this.recognition.start();
      this.isListening = true;
      console.log('음성 인식이 시작되었습니다.');
    }
    this.isCheck = true;
    this.sendVoiceBool();
  }

  // 녹음 중단
  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
      this.processVoiceToText(this.text);
      console.log(this.isCheck);
      console.log('음성 인식이 중단되었습니다.');
    }
  }

  // modal창 닫기 버튼 함수
  closeModal(): void {
    this.dialogRef.close();
    this.isCheck = false;
    this.sendVoiceBool();
  }

  async getAudio() {
    // mp3 다운로드 코드 삭제
    // mp3 blobUrl 걸어둬서 html로 넘긴 다음 audio 플레이어에 연결되게끔 현재 구현 완료
    // mp3 플레이어 자동 재생()

    try {
      console.log('base64값 : ', this.chatService.getbtyeString);

      // Base64 인코딩된 문자열을 Blob 데이터로 변환합니다.
      const byteCharacters = atob(this.chatService.getbtyeString()); // Base64 디코딩
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mpeg' });
      // Blob URL을 생성하고 오디오 URL로 설정합니다.
      this.audioUrl = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  getByteString(getByteString: any) {
    throw new Error('Method not implemented.');
  }
}
