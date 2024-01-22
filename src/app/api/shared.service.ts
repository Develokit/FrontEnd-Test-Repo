import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private sharedId: string = '';
  private tutorName : string = '';

  setId(id: string) {
    this.sharedId = id;
    console.log('Shared ID set to:', this.sharedId); // 디버깅을 위한 로그 추가
  }

  getId(): string {
    console.log('Shared ID retrieved:', this.sharedId);
    return this.sharedId;
  }

  setTutorName(name : string){
    this.tutorName = name;
  }

  getTutorName(){
    return this.tutorName;
  }

  isLoading: boolean = false;

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }
}
