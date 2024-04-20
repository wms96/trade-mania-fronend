import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginFormComponent} from "./login-form/login-form.component";
import {RegisterFormComponent} from "./register-form/register-form.component";
import {ChatComponent} from "./chat/chat.component";
import {ConversationsComponent} from "./conversations/conversations.component";

const routes: Routes = [
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule)
  }, {
    path: 'chat/:id',
    component: ChatComponent
  },
  {path: 'register', component: RegisterFormComponent},
  {path: 'conversations', component: ConversationsComponent},
  {path: 'login', component: LoginFormComponent},

  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
