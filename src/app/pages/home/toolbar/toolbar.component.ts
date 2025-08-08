import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { APP_NAME, IS_MEDIUM } from '../../../app.constants';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { WindowsObserverService } from '../../../core/services/utilities/windows-observer.service';
import {
  ThemeMode,
  ThemeService,
} from '../../../core/services/utilities/theme.service';
import { StateService } from '../../../core/services/utilities/state.service';
import { AuthService } from '../../../core/services/firebase/auth.service';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbarModule,
    MatDividerModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AsyncPipe,
  ],
  template: `
    <mat-toolbar>
      <div class="left-container">
        @if(viewport() <= medium ){
        <button mat-icon-button matTooltip="Menu" (click)="toggleDrawer()">
          <mat-icon>menu</mat-icon>
        </button>
        }
        <span
          ><b>{{ appName }}</b></span
        >
      </div>
      <div class="avatar-container">
        <button mat-icon-button matTooltip="Notifications">
          <mat-icon>notifications</mat-icon>
        </button>
        <img
          [matMenuTriggerFor]="menu"
          matTooltip="Profile"
          [src]="(user$ | async)?.photoURL ?? 'assets/avatar.png'"
          alt="avatar profile"
          width="32"
          height="32"
        />
      </div>
      <mat-menu #menu="matMenu">
        <button mat-menu-item [matMenuTriggerFor]="themeMenu">
          <mat-icon>dark_mode</mat-icon>
          <span>Theme</span>
        </button>
        <mat-divider></mat-divider>

        <button mat-menu-item (click)="logOut()">
          <mat-icon>logout</mat-icon>
          <span>Déconnexion</span>
        </button>
      </mat-menu>

      <mat-menu #themeMenu="matMenu">
        <button mat-menu-item (click)="switchTheme('device-theme')">
          Appareil
        </button>
        <button mat-menu-item (click)="switchTheme('light-theme')">
          Claire
        </button>
        <button mat-menu-item (click)="switchTheme('dark-theme')">
          Sombre
        </button>
      </mat-menu>
    </mat-toolbar>
    <mat-divider> </mat-divider>
  `,
  styles: `
   mat-toolbar {
    display: flex; 
    justify-content: space-between;
    align-items: center;

    .right-container, .avatar-container {
      display: flex;
      align-items: center;
      gap:0.5rem
    }

    img {
      border-radius: 50%;
      background: lightgray;
      cursor: pointer;
      transition: 250ms;

      &:hover {
        transform: scale(0.98);
      }
    }
  }
  
  `,
})
export class ToolbarComponent {
  appName = APP_NAME;
  medium = IS_MEDIUM;
  viewport = inject(WindowsObserverService).width;
  ts = inject(ThemeService);
  auth = inject(AuthService);
  user$ = this.auth.user;
  private router = inject(Router);
  switchTheme = (theme: ThemeMode) => {
    this.ts.setTheme(theme);
  };

  state = inject(StateService);

  toggleDrawer = () => this.state.toggleDrawer();

  async logOut() {
    await this.auth.logOut();
    this.router.navigate(['/login']);
  }
}
