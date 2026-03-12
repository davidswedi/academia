import { AsyncPipe } from '@angular/common';
import { User } from '@angular/fire/auth';
import { Component, computed, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IS_MEDIUM } from '../../../app.constants';
import { WindowsObserverService } from '../../../core/services/utilities/windows-observer.service';
import { StateService } from '../../../core/services/utilities/state.service';
import { AuthService } from '../../../core/services/firebase/auth.service';
import { FirestoreService } from '../../../core/services/firebase/firestore.service';
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
        <a routerLink="dashboard" mat-menu-item routerLinkActive="active-link">
          <mat-icon>home</mat-icon>
          Accueil</a
        >
        <a routerLink="interner" mat-menu-item routerLinkActive="active-link">
          <mat-icon>people</mat-icon>
          Stagiaire
        </a>
        <a routerLink="internship" mat-menu-item routerLinkActive="active-link">
          <mat-icon>dataset</mat-icon>
          Stage</a
        >
        @if (isAdmin) {
        <a routerLink="supervisor" mat-menu-item routerLinkActive="active-link">
          <mat-icon>person_2</mat-icon>
          Superviseur</a
        >
        <a routerLink="modules" mat-menu-item routerLinkActive="active-link">
          <mat-icon>book</mat-icon>
          Modules</a
        >
        <a routerLink="users" mat-menu-item routerLinkActive="active-link">
          <mat-icon
            ><span class="material-symbols-outlined">
              account_circle
            </span></mat-icon
          >
          Utilisateurs</a
        >
        }
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
      background: var(--primary-color);
    }
  `,
})
export class SidenavComponent {
  isMedium = IS_MEDIUM;
  auth = inject(AuthService);
  user$ = this.auth.user;
  viewPort = inject(WindowsObserverService).width;
  fs = inject(FirestoreService);
  state = inject(StateService);
  isToggleDrawer = computed(() => this.state.isToggleDrawer());
  isAdmin : boolean = false;
  ngOnInit() {
    this.user$.subscribe(user=>{
      const userEmail = user?.email;
      this.fs.getuser(userEmail!).subscribe(userData=>{
        this. isAdmin = userData[0]?.role === 'admin' ? true : false;
      })
    })
  }
}
