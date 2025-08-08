import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/services/firebase/auth.service';
import { LoginSkeletonComponent } from './login-skeleton.component';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { APP_NAME, COMPANY_NAME } from '../../app.constants';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    LoginSkeletonComponent,
  ],
  templateUrl: './login.component.html',
  styles: `
   .divider{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin:1rem 0;
     
    mat-divider{
      width:35%;
    }
   }
  `,
})
export default class LoginComponent implements OnInit, OnDestroy {
  appName = APP_NAME;
  companyName = COMPANY_NAME;
  date = new Date();
  loading = signal(true);
  auth = inject(AuthService);
  authSub?: Subscription;
  private router = inject(Router);
  emailSent = signal('');
  loginWithGoogle = async () => {
    try {
      this.loading.set(true);
      await this.auth.logInWithGoogle();
      this.loading.set(false);
    } catch (exception) {
      this.loading.set(false);
      location.reload();
      console.log(exception);
    }
  };
  emailFormSubmit(form: NgForm) {
    const email = form.value.email;

    const actionCodeSettings = {
      url: `${location.origin}${this.router.url}`,
      handleCodeInApp: true,
    };

    this.auth.sendAuthLink(email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
    this.emailSent.set(email);
    form.reset();
  }

  resetState = () => this.emailSent.set('');
  ngOnInit(): void {
    //watching auth state
    this.authSub = this.auth.authState.subscribe((user: User | null) => {
      this.loading.set(false);
      //On email redirection, initialize authentication
      if (this.router.url.includes('login?apiKey=')) {
        this.loading.set(true);
        this.auth.loginWithEmailLink();
      }

      if (user) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }
}
