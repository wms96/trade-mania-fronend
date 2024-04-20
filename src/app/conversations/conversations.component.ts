import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonContent, IonicModule, IonInfiniteScroll} from '@ionic/angular';
import {ChatService} from '../../services/chat.service';
import {AuthService} from '../../services/auth.service';
import Pusher from 'pusher-js';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {IConversation} from "../../models/IConversation";
import {AlertService} from "../../services/alert.service";
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-chat',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    FormsModule
  ],
  standalone: true
})
export class ConversationsComponent implements OnInit, OnDestroy {
  id!: number;
  userId!: number;
  conversations: IConversation[] = [];
  @ViewChild('content', {static: false}) content: IonContent | undefined;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll | undefined;
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.userId = this.authService.currentAuthStateValue!.user!.id
    this.id = this.activatedRoute.snapshot.params['id'];
    var pusher = new Pusher(environment.pusherAppKey, {
      cluster: environment.pusherClusterKey
    });
    var channel = pusher.subscribe('chat' + this.userId);
    channel.bind('my-event', () => {
      this.fetchInitialConversations();
      this.playSound('../../assets/notification.wav');
      this.alertService.toastAlert('You received a new message')
    });
    // Fetch initial messages
    this.fetchInitialConversations();
  }

  fetchInitialConversations(): void {
    const getChatSub = this.chatService.getChats().subscribe((response) => {
      this.conversations = response
    });
    this.subscriptions.push(getChatSub)
  }


  playSound(soundUrl: string): void {
    const audio = new Audio(soundUrl);
    audio.play();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

}
