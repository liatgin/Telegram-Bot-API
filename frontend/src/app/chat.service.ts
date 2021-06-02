import { Injectable } from '@angular/core';
import { WebsocketService } from './web-socket.service';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class ChatService {

  messages: Subject<any>;

  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        return response;
      })
   }
}