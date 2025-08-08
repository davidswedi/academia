import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../../../core/services/firebase/firestore.service';
import { AuthService } from '../../../../core/services/firebase/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Interner } from '../../../../core/models/stagiaire.model';
import { FieldValue, serverTimestamp } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
@Component({
  selector: 'app-set-interner',
  imports: [
    MatDividerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Nouveau Stagiaire</h2>
    <mat-divider />
    <mat-dialog-content>
      <form [formGroup]="internerForm">
        <mat-form-field appearance="outline">
          <mat-label>Nom</mat-label>
          <input
            matInput
            #titleInput
            maxlength="50"
            placeholder="Ex. David"
            formControlName="name"
          />
          <mat-hint align="end">{{ titleInput.value.length }}/50</mat-hint>

          @if (internerForm.controls.name.hasError('required')) {
          <mat-error>le nom est obligatoire</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Post Nom</mat-label>
          <input
            matInput
            #titleInput
            maxlength="50"
            placeholder="Ex.Swedi"
            formControlName="lastname"
          />
          <mat-hint align="end">{{ titleInput.value.length }}/50</mat-hint>

          @if (internerForm.controls.lastname.hasError('required')) {
          <mat-error>Le postnom est obligatoire</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Prenom</mat-label>
          <input
            matInput
            #titleInput
            maxlength="50"
            placeholder="Ex.Olivia"
            formControlName="firstname"
          />
          <mat-hint align="end">{{ titleInput.value.length }}/50</mat-hint>

          @if (internerForm.controls.firstname.hasError('required')) {
          <mat-error>Le prenom est obligatoire</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Sexe</mat-label>
          <mat-select formControlName="gender">
            <mat-option value="Masculin">Masculin</mat-option>
            <mat-option value="Feminin">Feminin</mat-option>
          </mat-select>
          @if (internerForm.controls.gender.hasError('required')) {
          <mat-error>la sexe est obligatoire</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Téléphone</mat-label>
          <input
            matInput
            #titleInput
            maxlength="50"
            placeholder="Ex.0998464508"
            formControlName="phone"
          />
          <mat-hint align="end">{{ titleInput.value.length }}/50</mat-hint>

          @if (internerForm.controls.phone.hasError('required')) {
          <mat-error>Le departement est obligatoire</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input
            matInput
            #titleInput
            maxlength="50"
            placeholder="Ex. davidswedi700@gmail.com"
            formControlName="email"
          />
          <mat-hint align="end">{{ titleInput.value.length }}/50</mat-hint>

          @if (internerForm.controls.email.hasError('required')) {
          <mat-error>L'email est obligatoire</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Promotion</mat-label>
          <input
            matInput
            #titleInput
            maxlength="50"
            placeholder="Ex.Bac1"
            formControlName="promotion"
          />
          <mat-hint align="end">{{ titleInput.value.length }}/50</mat-hint>

          @if (internerForm.controls.promotion.hasError('required')) {
          <mat-error>La promotion est obligatoire</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Departement</mat-label>
          <input
            matInput
            #titleInput
            maxlength="50"
            placeholder="Ex. Genie Logiciel/Scientifique"
            formControlName="departement"
          />
          <mat-hint align="end">{{ titleInput.value.length }}/50</mat-hint>

          @if (internerForm.controls.departement.hasError('required')) {
          <mat-error>Le departement est obligatoire</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Institution</mat-label>
          <input
            matInput
            #titleInput
            maxlength="50"
            placeholder="Ex. Unikal"
            formControlName="college"
          />
          <mat-hint align="end">{{ titleInput.value.length }}/50</mat-hint>

          @if (internerForm.controls.college.hasError('required')) {
          <mat-error>L'institution est obligatoire</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-divider />

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button (click)="onSubmit()">Enregistrer</button>
    </mat-dialog-actions>
  `,
  styles: `
  mat-form-field{
    width:49%;
    margin:0 2px;
  }
  `,
})
export class SetInternerComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  readonly user$ = this.auth.user;
  readonly interner = inject<Interner<FieldValue> | undefined>(MAT_DIALOG_DATA);

  internerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    firstname: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    promotion: ['', [Validators.required]],
    departement: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required]],
    college: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.interner) {
      this.internerForm.patchValue(this.interner);
    }
  }

  onSubmit() {
    if (this.internerForm.invalid) {
      this.internerForm.markAllAsTouched();

      return;
    }

    const internerCollection = this.fs.internerCol;
    //const internerId = this.fs.creasteDocId(internerCollection);
    const internerId = this.interner
      ? this.interner.id
      : this.fs.creasteDocId(internerCollection);
    const interner: Interner<FieldValue> = {
      id: internerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...this.internerForm.getRawValue(),
    };

    this.fs.setInterner(interner);
    this.dialog.closeAll();

    const message = this.interner
      ? 'Stagiaire modifie  avec success'
      : 'Stagiaire ajoute  avec success';
    this.snackBar.open(message, '', { duration: 5000 });
  }
}
