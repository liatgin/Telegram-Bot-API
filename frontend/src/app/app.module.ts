import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ChatService} from './chat.service'
import {WebsocketService} from './web-socket.service'
import {MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
  ],
  providers: [ChatService, WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
