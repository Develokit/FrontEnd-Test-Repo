import { Routes } from '@angular/router';
import { ChatTutorComponent } from './layout/chat-tutor/chat-tutor.component';
import { DetailComponent } from './layout/detail/detail.component';
import { CreateComponent } from './layout/create/create.component';
import { HomeComponent } from './layout/home/home.component';
import { UpdateComponent } from './layout/update/update.component';

export const routes: Routes = [
  {
    path: 'chat-tutor',
    component: ChatTutorComponent,
  },
  {
    path: 'detail',
    component: DetailComponent,
  },
  {
    path: 'create-tutor',
    component: CreateComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'update-tutor',
    component: UpdateComponent,
  },
];
