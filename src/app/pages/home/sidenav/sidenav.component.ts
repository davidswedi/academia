import { Component, computed, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IS_MEDIUM } from '../../../app.constants';
import { WindowsObserverService } from '../../../core/services/utilities/windows-observer.service';
import { StateService } from '../../../core/services/utilities/state.service';
@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    RouterOutlet,
    RouterLink,
    MatIconModule,
    MatMenuModule,
    RouterLinkActive,
  ],
  template: `
    <mat-drawer-container autosize style=" height: calc(100vh - 65px)">
      <mat-drawer
        [mode]="viewPort() >= isMedium ? 'side' : 'over'"
        [opened]="viewPort() >= isMedium || isToggleDrawer()"
      >
        <a routerLink="/interner" mat-menu-item routerLinkActive="active-link">
          <mat-icon>dataset</mat-icon>
          Stagiaire
        </a>
        <a
          routerLink="/internship"
          mat-menu-item
          routerLinkActive="active-link"
        >
          <mat-icon>people</mat-icon>
          Stage</a
        >
      </mat-drawer>
      <mat-drawer-content>
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: `
 
    mat-drawer {
      width: 220px;
      border-right: 1px solid var(--mat-sys-outline-variant);
      border-radius: 0%;
    }
    
    .active-link {
      background: var(--mat-sys-outline-variant);
    }
  `,
})
export class SidenavComponent {
  isMedium = IS_MEDIUM;

  viewPort = inject(WindowsObserverService).width;

  state = inject(StateService);
  isToggleDrawer = computed(() => this.state.isToggleDrawer());
}
