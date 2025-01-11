import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket | null = null;
  private serverUrl = 'http://localhost:3000'; 

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket = io(this.serverUrl);
    }
  }

  totalOnlineUser():  Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on('totalOnlineUser', (message: any) => {
          observer.next(message);
        });
      }
    });
  }

  
  // Send a message
  sendMessage(data: { message: string; username: string; timestamp: Date }) {
    if (this.socket) {
      this.socket.emit('message', data);
    }
  }

  // Receive messages
  receiveMessages(): Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on('receiveMessage', (data: { message: string; username: string; timestamp: Date; }) => {
          observer.next(data);
        });
      }
    });
  }

   // Emit typing event
   sendTyping(data: { username: string }) {
    if (this.socket) {
      this.socket.emit('typing', data);
    }
  }

  // Receive typing events
  receiveTyping(): Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on('typing', (data) => {
          observer.next(data);
        });
      }
    });
  }
}
