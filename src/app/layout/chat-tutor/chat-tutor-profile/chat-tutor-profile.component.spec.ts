import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTutorProfileComponent } from './chat-tutor-profile.component';

describe('ChatTutorProfileComponent', () => {
  let component: ChatTutorProfileComponent;
  let fixture: ComponentFixture<ChatTutorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatTutorProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatTutorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
