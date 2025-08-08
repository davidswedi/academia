import { Component } from '@angular/core';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
  selector: 'app-home',
  imports: [ToolbarComponent, SidenavComponent],
  template: `
    <app-toolbar></app-toolbar>
    <app-sidenav></app-sidenav>
  `,
  styles: ``,
})
export default class HomeComponent {}
