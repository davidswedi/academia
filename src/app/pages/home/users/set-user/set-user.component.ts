import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService } from '../../../../core/services/firebase/firestore.service';
import { FieldValue, serverTimestamp } from '@angular/fire/firestore';
import { User } from '../../../../core/models/user.model';
import { USER_ROLES } from '../../../../core/models/role.model';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-set-user',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatDivider,
  ],
  template: `
    <h2 mat-dialog-title>Nouvel Utilisateur</h2>
    <mat-divider />
    <mat-dialog-content>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Nom complet</mat-label>
          <input matInput formControlName="fullName" required />
          @if (userForm.controls.fullName.hasError('required')) {
          <mat-error> Le nom complet est obligatoire </mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" required type="email" />
          @if (userForm.controls.email.hasError('required')) {
          <mat-error> L'email est obligatoire </mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            @for (r of roles; track $index) {
            <mat-option [value]="r">{{ r }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <div style="margin-top:1rem; text-align:right"></div>
      </form>
    </mat-dialog-content>
    <mat-divider />

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button
        mat-flat-button
        [disabled]="userForm.invalid"
        (click)="onSubmit()"
      >
        Enregistrer
      </button>
    </mat-dialog-actions>
  `,
  styles: `
   mat-form-field{
    width:49%;
    margin:1px 2px;
  }
  /* Make form fields full width on small screens */
  @media (max-width: 600px) {
    mat-form-field{
      width:100% !important;
      margin: 0 0 0.5rem 0;
    }
  }
  `,
})
export class SetUserComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fs = inject(FirestoreService);
  private userCollection = this.fs.userCol;
  roles = USER_ROLES as readonly string[];
  user = inject<User<FieldValue | undefined>>(MAT_DIALOG_DATA);
  userForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['student', [Validators.required]],
  });
  ngOnInit() {
    if (this.user) {
      this.userForm.patchValue(this.user);
    }
  }
  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const id = this.user
      ? this.user.id
      : this.fs.creasteDocId(this.userCollection);
    const user: User<FieldValue> = {
      id,
      createdAt: serverTimestamp(),
      ...this.userForm.getRawValue(),
    };
    this.fs.setUser(user);
    this.dialog.closeAll();
    this.snackBar.open('Utilisateur ajouté avec succès', '', {
      duration: 3000,
    });
  }
}
