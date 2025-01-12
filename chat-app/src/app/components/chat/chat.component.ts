import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent {
  @ViewChild('userNameInput') userNameInput!: ElementRef;

  message: string = ''
  chatMessages: any[] = [];
  onlineUsers: number = 0
  username: string = ''
  // generateUniqueName: string = 'User' + Math.floor(Math.random() * 1000);

  typingUser: string = '';
  isTyping: boolean = false;

  constructor(private cs: ChatService) {}

  ngOnInit() {
    this.gettingAllChats()

    this.cs.totalOnlineUser().subscribe((data) => {
      this.onlineUsers = data
    });

     // Listen for typing events
     this.cs.receiveTyping().subscribe((data: { username: string }) => {
      this.removeTypingMessage();

      this.typingUserNameShowInUi(data)
      this.typingUser = data.username;
      this.isTyping = true;

     })
  } 

  // alert message while username is empty
  alertUserToEnterName() {
    alert('enter your name');
    this.userNameInput.nativeElement.focus();
  }

  // sending message to websockets
  sendMessage() {
    if(this.username != '') {
      if(this.message != '') {
        const data = {
          message: this.message,
          username: this.username,
          timestamp: new Date()
        }
        this.cs.sendMessage(data);
        this.showOwnMessageInUi(true, data)
        this.message = '';
      }
    } else {
      this.alertUserToEnterName();
    }
  }

  // getting chats histroy
  gettingAllChats() {
    // Listen for messages from the server
    this.cs.receiveMessages().subscribe((data) => {
      // Check if the message is not sent by the current user
      if (data.username !== this.username || this.username == '') {
        this.chatMessages.push(data);
        this.showOwnMessageInUi(false, data);
        this.removeTypingMessage();
      }
    });
  }

  // showing messages based on own and received side
  showOwnMessageInUi(ownMsg: boolean, data: { message: string; username: string; timestamp:Date;}) {
    this.removeTypingMessage();
    if (data) {
      const e = `<li class="${ownMsg ? 'message_right' : 'message_left'}">
                    <p class="message">
                        ${data.message}
                        <span>${data.username} | ${this.formatTimestamp(data.timestamp)}</span>
                    </p>
                </li>`;

      this.appendListInUi(e)
    }
  }

  // formatted timestamp
  formatTimestamp(timestamp: Date) {
    const date = new Date(timestamp);
  
    const day = date.getDate().toString().padStart(2, '0'); // Day in 2 digits
    const month = date.toLocaleString('en-US', { month: 'short' }); // Short month name
    const hours = date.getHours().toString().padStart(2, '0'); // Hours in 2 digits
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Minutes in 2 digits
  
    return `${day} ${month} ${hours}:${minutes}`;
  }

  // message input, typing messages to username from opposite side
  onTyping() {
    if(this.username != '') {
      this.cs.sendTyping({ username: this.username });
    } else {
      this.alertUserToEnterName();
    }
  }

  // showing typing feedback message
  typingUserNameShowInUi(data: { username: string }) {
    const e = `<li class="feedback_container">
                    <p class="feedback"> ${data.username} is typing </p>
                </li>`

    this.appendListInUi(e)
  }

  // appends new li tags in dynamically in chat list(ui)
  appendListInUi(e: string) {
    const messageBody = document.getElementById('body_container');
    
    if (messageBody) {
      messageBody.insertAdjacentHTML('beforeend', e); // Safely append the message
      messageBody.scrollTop = messageBody.scrollHeight; // Auto-scroll to the bottom
    }
  }

  // remove typing feedback message
  removeTypingMessage() {
    document.querySelectorAll('li.feedback_container').forEach(e => {
      e.parentNode?.removeChild(e)
    })
  }
}
