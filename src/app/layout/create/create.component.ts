import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CreateService } from '../../api/create.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    NgIf,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  uploadedImage: string | undefined;
  isImageUploaded: boolean = false; // 이미지 업로드 상태
  isFileUploaded: boolean = false; // 파일 업로드 상태
  isFileUploaded2: boolean = false; // 파일 업로드 상태
  fileName1 = '';
  fileName2 = '';
  files: File[] = [];
  file1: File | null = null; // 첫 번째 파일을 위한 속성
  file2: File | null = null; // 두 번째 파일을 위한 속성
  imgFile: File | null = null;
  instruction: string = '';
  name: string = '';
  description: string = '';
  voice: string = '';
  personality: string = '';
  speechLevel: string = '';
  textLengthName = 0; // 여기서부터 글자 수 세는거
  textLengthInstruction = 0;
  textLengthDescription = 0;
  protected isLoading : boolean = false;

  createForm: FormGroup = new FormGroup({
    imgFile: new FormControl(null, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    instruction: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    file1: new FormControl(null),
    file2: new FormControl(null),
    personality: new FormControl([], [Validators.required]),
    voice: new FormControl([], [Validators.required]),
    speechLevel: new FormControl([], [Validators.required]),
    emotion: new FormControl([]),
  });

  constructor(
    private router: Router,
    private createService: CreateService,
    private formbulider: FormBuilder
  ) {}

  generateInstruction(){
    this.isLoading = true;
    this.createService.generateInstruction(this.createForm.value.instruction)
      .then((response)=>{
        console.log("response : " + response.data);
        this.createForm.patchValue({ instruction: response.data });
        this.isLoading = false;
      })
      .catch(error=>{
        console.error("error :" + error);
        this.isLoading = false;
      })
  }

  submitForm() {
    if (!this.imgFile || this.createForm.invalid) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    this.isLoading = true;
    if (this.file1 && this.file2) {
      const formData = this.createForm.value;

      console.log(this.createForm.value);

      // 필요한 데이터를 handleNoFile 함수에 전달합니다.
      this.createService
        .handleDualFiles(
          this.imgFile, // 또는 this.imgFile (이미지 파일)
          formData.instruction, // 사용자가 입력한 지침
          formData.name, // 사용자가 입력한 이름
          formData.description, // 사용자가 입력한 설명
          formData.voice, // 사용자가 선택한 음성
          formData.personality, // 사용자가 선택한 성격
          formData.speechLevel, // 사용자가 선택한 존대말 여부
          this.file1,
          this.file2
        )
        .then((response) => {
          console.log('Response:', response);
          this.isLoading = false;
          alert("튜터 생성이 완료되었습니다.");
          this.router.navigate(['home']);
        })
        .catch((error) => {
          this.isLoading = false;
          console.error('Error:', error);
        });
    } else if (this.file1) {
      const formData = this.createForm.value;

      console.log(this.createForm.value);

      // 필요한 데이터를 handleNoFile 함수에 전달합니다.
      this.createService
        .handleOneFile(
          this.imgFile, // 또는 this.imgFile (이미지 파일)
          formData.instruction, // 사용자가 입력한 지침
          formData.name, // 사용자가 입력한 이름
          formData.description, // 사용자가 입력한 설명
          formData.voice, // 사용자가 선택한 음성
          formData.personality, // 사용자가 선택한 성격
          formData.speechLevel, // 사용자가 선택한 존대말 여부
          this.file1
        )
        .then((response) => {
          console.log('Response:', response);
          this.isLoading = false;
          alert("튜터 생성이 완료되었습니다.");
          this.router.navigate(['home']);
        })
        .catch((error) => {
          console.error('Error:', error);
          this.isLoading = false;
        });
    } else {
      // 폼 그룹에서 사용자의 입력 데이터를 가져옵니다.
      const formData = this.createForm.value;

      console.log(this.createForm.value);

      // 필요한 데이터를 handleNoFile 함수에 전달합니다.
      this.createService
        .handleNoFile(
          this.imgFile, // 또는 this.imgFile (이미지 파일)
          formData.instruction, // 사용자가 입력한 지침
          formData.name, // 사용자가 입력한 이름
          formData.description, // 사용자가 입력한 설명
          formData.voice, // 사용자가 선택한 음성
          formData.personality, // 사용자가 선택한 성격
          formData.speechLevel // 사용자가 선택한 존대말 여부
        )
        .then((response) => {
          console.log('Response:', response);
          this.isLoading = false;
          alert("튜터 생성이 완료되었습니다.");
          this.router.navigate(['home']);
        })
        .catch((error) => {
          console.error('Error:', error);
          this.isLoading = false;
        });
    }
  }

  userSelection: string | null = null;

  selectOption(option: string) {
    this.userSelection = option;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.imgFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
        this.isImageUploaded = true;
      };

      reader.readAsDataURL(file);
    }
  }
  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        // file이 존재하는지 확인
        this.file1 = file; // 첫 번째 파일 객체 저장
        this.fileName1 = file.name;
        this.isFileUploaded = true;
      }
    }
  }

  deleteFile1(): void {
    this.file1 = null; // 파일 객체 초기화
    this.fileName1 = ''; // 파일 이름 초기화
    this.isFileUploaded = false; // 업로드 상태 초기화
  }

  onFileSelect2(event: any): void {
    if (event.target.files.length > 0) {
      this.file2 = event.target.files[0]; // 두 번째 파일 객체 저장
      // @ts-ignore
      this.fileName2 = this.file2.name;
      this.isFileUploaded2 = true;
    }
  }

  deleteFile2(event: MouseEvent): void {
    this.file2 = null; // 파일 객체 초기화
    this.fileName2 = ''; // 파일 이름 초기화
    this.isFileUploaded2 = false; // 업로드 상태 초기화
  }

  getImgFile(): FormControl {
    return this.createForm.get('imgFile') as FormControl;
  }

  getName(): FormControl {
    return this.createForm.get('name') as FormControl;
  }

  getExplain(): FormControl {
    return this.createForm.get('instruction') as FormControl;
  }

  getRule(): FormControl {
    return this.createForm.get('description') as FormControl;
  }

  getPersonality(): FormControl {
    return this.createForm.get('personality') as FormControl;
  }

  getVoice(): FormControl {
    return this.createForm.get('voice') as FormControl;
  }

  getAccent(): FormControl {
    return this.createForm.get('speechLevel') as FormControl;
  }

  // 글자 수 세는 코드
  onTextChangeName(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.textLengthName = inputValue.length;
  }

  onTextChangeInstruction(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.textLengthInstruction = inputValue.length;
  }

  onTextChangeDescription(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.textLengthDescription = inputValue.length;
  }
}
