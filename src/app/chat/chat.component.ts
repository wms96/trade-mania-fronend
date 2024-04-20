import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonContent, IonicModule, IonInfiniteScroll} from '@ionic/angular';
import {ChatService} from '../../services/chat.service';
import {IMessage} from '../../models/IMessage';
import {AuthService} from '../../services/auth.service';
import Pusher from 'pusher-js';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    FormsModule
  ],
  standalone: true
})
export class ChatComponent implements OnInit, OnDestroy {
  id!: number;
  userId!: number;
  messages: IMessage[] = [];
  newMessage: string = '';
  currentPage: number = 1;
  loading: boolean = false;
  lastPage: number = 1;
  @ViewChild('content', {static: false}) content: IonContent | undefined;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll | undefined;
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.userId = this.authService.currentAuthStateValue!.user!.id
    this.id = this.activatedRoute.snapshot.params['id'];
    const pusher = new Pusher(environment.pusherAppKey, {
      cluster: environment.pusherClusterKey
    });
    const channelFrom = pusher.subscribe('chat' + this.id);
    channelFrom.bind('my-event', (data: { message: IMessage }) => {
      this.messages.push(data.message)
      this.scrollToBottom();

    });
    const channelTo = pusher.subscribe('chat' + this.userId);
    channelTo.bind('my-event', (data: { message: IMessage }) => {
      this.messages.push(data.message)
      this.scrollToBottom();
    });
    this.fetchInitialMessages();
  }

  fetchInitialMessages(): void {
    const getChatSub = this.chatService.getChat(this.id).subscribe((response) => {
      this.messages = response?.data?.reverse();
      this.lastPage = response.last_page
      this.scrollToBottom();
    });
    this.subscriptions.push(getChatSub)
  }

  sendMessage(): void {
    this.loading = true;
    const sendMessageSub = this.chatService.sendMessage(this.newMessage, this.id).subscribe({
      next: (data) => {
        this.newMessage = '';
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
    this.subscriptions.push(sendMessageSub)

  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.content?.scrollToBottom();
    }, 100);
  }


  loadMoreMessages(event: any): void {
    if (this.lastPage === this.currentPage) {
      return
    }
    const getChatSub = this.chatService.getChat(this.id, this.currentPage + 1).subscribe((response) => {
      const newMessages = response?.data?.reverse();
      this.currentPage = response.current_page
      this.lastPage = response.last_page
      this.messages = [...newMessages, ...this.messages,];
      event.target.complete();
    });
    this.subscriptions.push(getChatSub)
  }

  async onScroll(event: any): Promise<void> {
    const scrollTop = await this.content?.getScrollElement().then(el => el.scrollTop);
    if (scrollTop === 0) {
      // User has scrolled to the top
      this.loadMoreMessages(event);
    }
  }
}
