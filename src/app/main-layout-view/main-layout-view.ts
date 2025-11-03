import { Component } from '@angular/core';
import { ChatAssistant } from '../chat-assistant/chat-assistant';
import { MainPage } from '../main-page/main-page';

@Component({
  selector: 'app-main-layout-view',
  imports: [ChatAssistant , MainPage],
  templateUrl: './main-layout-view.html',
  styleUrl: './main-layout-view.scss',
})
export class MainLayoutView {

}
