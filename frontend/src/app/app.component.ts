import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import * as moment from 'moment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chat-bot-messages';
  chatMessages = []

  constructor(private chat: ChatService){ }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      console.log(msg);
      this.chatMessages.push(msg.message)
    })
  }

  timeFormater(timeInUnixFormat) {
    console.log('time',moment.unix(timeInUnixFormat).format('LT'));
    return moment.unix(timeInUnixFormat).format('LT')
  }


}
