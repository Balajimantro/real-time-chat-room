import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
    {path: '', redirectTo: 'room-chat', pathMatch: 'full'},
    {path: 'room-chat', component: ChatComponent}
];