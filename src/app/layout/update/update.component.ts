import { Component, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UpdateService } from '../../api/update-service';
import { Router } from '@angular/router';
import { HomeService } from '../../api/home-service';
import axios from 'axios';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [MatChipsModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateComponent implements OnInit {
  beforeImgUrl: string = '';
  //uploadedImage: string = '';
  isImageUploaded: boolean = false; // 이미지 업로드 상태
  isFileUploaded: boolean = false; // 파일 업로드 상태
  isFileUploaded2: boolean = false; // 파일 업로드 상태
  fileName1 = '';
  fileName2 = '';
  files: File[] = [];
  file1: File | null = null; // 첫 번째 파일을 위한 속성
  file2: File | null = null; // 두 번째 파일을 위한 속성
  //imgFile: File | null = null;
  afterImgUrl: File | null = null;
  afterImgFile: File | null = null;
  instruction: string = '';
  name: string = '';
  description: string = '';
  voice: string = '';
  personality: string = '';
  speechLevel: string = '';

  updateForm: FormGroup = new FormGroup({
    imgFile: new FormControl(null, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    instruction: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    file1: new FormControl(null),
    file2: new FormControl(null),
    personality: new FormControl([], [Validators.required]),
    voice: new FormControl([], [Validators.required]),
    speechLevel: new FormControl([], [Validators.required]),
  });

  constructor(private router: Router, private updateService: UpdateService) {}

  ngOnInit() {
    this.updateService
      .enterUpdateTutor()
      .then((response) => {
        console.log(JSON.stringify(response.data, null, 2));

        if (response && response.data) {
          const data = response.data; // 백엔드에서 받은 데이터
          this.updateForm.patchValue({
            name: data.name,
            instruction: data.instruction,
            description: data.description,
            personality: data.personality,
            voice: data.voice,
            speechLevel: data.speechLevel,
          });

          this.beforeImgUrl = data.img; // 이미지 URL 받는거
          this.isImageUploaded = true;

          // fileNames 배열 처리
          if (data.fileNames && data.fileNames.length > 0) {
            this.fileName1 = data.fileNames[0];
            this.isFileUploaded = true;

            if (data.fileNames.length > 1) {
              this.fileName2 = data.fileNames[1];
              this.isFileUploaded2 = true;
            }
          }

          //console.log(this.updateForm.value);
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error('Error fetching data in component: ', error);
      });
  }

  generateInstruction(){
    alert("Instruction 업데이트 실행!!!!!");
    this.updateService.generateInstruction(this.updateForm.value.instruction)
      .then((response)=>{
        console.log("response : " + response.data);
        this.updateForm.patchValue({ instruction: response.data });
      })
      .catch(error=>{
        console.error("error :" + error);
      })
  }

  submitForm(): void {
    const formData = this.updateForm.value;
    const updatedData = new FormData();

    if (this.afterImgFile !== null) {
      this.updateService
        .updateImage(this.afterImgFile)
        .then((response) => {
          console.log('Image update response:', response);
        })
        .catch((error) => {
          console.error('Error updating image:', error);
        });
    } else {
      console.error('No image file to update');
    }

    //변경된 부분만 formData에 추가
    Object.keys(formData).forEach((key) => {
      if (this.updateForm.get(key)?.dirty) {
        const value = formData[key];
        if (value instanceof File) {
          updatedData.append(key, value, value.name);
        } else {
          updatedData.append(key, value);
        }
      }
    });

    if (this.file1 && this.file2) {
      this.updateService
        .updateTutorDual(
          formData.instruction,
          formData.name,
          formData.description,
          formData.voice,
          formData.personality,
          formData.speechLevel,
          this.file1,
          this.file2
        )
        .then((response) => {
          console.log('Response:', response);
          console.log(this.updateForm.value);
          alert('수정되었습니다.');
          this.router.navigate(['home']);
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('수정에 실패하였습니다.');
        });
    } else if (this.file1) {
      this.updateService
        .updateTutorOne(
          formData.instruction,
          formData.name,
          formData.description,
          formData.voice,
          formData.personality,
          formData.speechLevel,
          this.file1
        )
        .then((response) => {
          console.log('Response:', response);
          console.log(this.updateForm.value);
          alert('수정되었습니다.');
          this.router.navigate(['home']);
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('수정에 실패하였습니다.');
        });
    } else {
      this.updateService
        .updateTutorNone(
          formData.instruction,
          formData.name,
          formData.description,
          formData.voice,
          formData.personality,
          formData.speechLevel
        )
        .then((response) => {
          console.log('Response:', response);
          console.log(this.updateForm.value);
          alert('수정되었습니다.');
          this.router.navigate(['home']);
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('수정에 실패하였습니다.');
        });
    }
  }

  deleteForm(): void {
    console.log('Form deleted');

    this.updateService
      .deleteTutor()
      .then((response) => {
        // 요청이 성공적으로 완료되었을 때
        console.log('Delete response:', response);
        alert('삭제되었습니다.');
        this.router.navigate(['home']);
      })
      .catch((error) => {
        // 오류가 발생했을 때
        console.error('Delete error:', error);
        alert('삭제에 실패했습니다.');
      });
  }

  onFileSelected(event: any): void {
    // 이벤트에서 선택된 파일을 가져옵니다.
    const file = event.target.files[0];
    // 파일이 존재하는지 확인합니다.
    if (file) {
      // 선택된 파일 객체를 this.afterImgUrl에 저장합니다.
      this.afterImgUrl = file;
      this.afterImgFile = file;
      // FileReader 인스턴스를 생성합니다.
      const reader = new FileReader();
      // 파일을 로드하고 완료되면 실행될 콜백 함수를 정의합니다.
      reader.onload = (e: any) => {
        // 파일 내용을 this.afterImgUrl에 저장합니다.
        this.afterImgUrl = e.target.result;
        // 이미지가 업로드되었다는 플래그를 true로 설정합니다.
        this.isImageUploaded = true;
      };
      // FileReader를 사용하여 파일의 내용을 읽고 데이터 URL로 변환합니다.
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
    return this.updateForm.get('imgFile') as FormControl;
  }

  getName(): FormControl {
    return this.updateForm.get('name') as FormControl;
  }

  getExplain(): FormControl {
    return this.updateForm.get('instruction') as FormControl;
  }

  getRule(): FormControl {
    return this.updateForm.get('description') as FormControl;
  }

  getPersonality(): FormControl {
    return this.updateForm.get('personality') as FormControl;
  }

  getVoice(): FormControl {
    return this.updateForm.get('voice') as FormControl;
  }

  getAccent(): FormControl {
    return this.updateForm.get('speechLevel') as FormControl;
  }
}
