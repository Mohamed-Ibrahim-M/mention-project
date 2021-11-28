import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MentionDirectiveDirective } from './mention-directive/mention-directive.directive';
import { MentionItemsComponent } from './mention-items/mention-items.component';

@NgModule({
  declarations: [
    AppComponent,
    MentionDirectiveDirective,
    MentionItemsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
