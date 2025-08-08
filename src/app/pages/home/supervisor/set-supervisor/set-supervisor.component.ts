import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { Supervisor } from '../../../../core/models/superviseur.model';
import { FieldValue, serverTimestamp } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService } from '../../../../core/services/firebase/firestore.service';

@Component({
  selector: 'app-set-supervisor',
  imports: [
    MatDividerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: ` <h2 mat-dialog-title>Nouveau Stagiaire</h2>
    <mat-divider />
    <mat-dialog-content>
      <form [formGroup]="supervisorForm">
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

          @if (supervisorForm.controls.name.hasError('required')) {
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

          @if (supervisorForm.controls.lastname.hasError('required')) {
          <mat-error>Le postnom est obligatoire</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input
            matInput
            #titleInput
            maxlength="50"
            placeholder="Ex.Developpeur"
            formControlName="title"
          />
          <mat-hint align="end">{{ titleInput.value.length }}/50</mat-hint>

          @if (supervisorForm.controls.title.hasError('required')) {
          <mat-error>Renseignez une fonction</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Specialisation</mat-label>
          <mat-select formControlName="specialisation">
            <mat-option value="network">Réseau</mat-option>
            <mat-option value="vsat">VSAT</mat-option>
            <mat-option value="electronic">Securité Electronique</mat-option>
            <mat-option value="developer">Développeur</mat-option>
          </mat-select>
          @if (supervisorForm.controls.specialisation.hasError('required')) {
          <mat-error>Veuillez préciser une specialité</mat-error>
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

          @if (supervisorForm.controls.phone.hasError('required')) {
          <mat-error>Le numero est obligatoire</mat-error>
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

          @if (supervisorForm.controls.email.hasError('required')) {
          <mat-error>L'email est obligatoire</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-divider />

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button (click)="onSubmit()">Enregistrer</button>
    </mat-dialog-actions>`,
  styles: `
  mat-form-field{
    width:49%;
    margin:0 2px;
  }
  `,
})
export class SetSupervisorComponent {
  private fs = inject(FirestoreService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private supervisor = inject<Supervisor<FieldValue> | undefined>(
    MAT_DIALOG_DATA
  );
  private snackbar = inject(MatSnackBar);

  supervisorForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    title: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    specialisation: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.supervisor) {
      this.supervisorForm.patchValue(this.supervisor);
    }
  }

  onSubmit() {
    if (this.supervisorForm.invalid) {
      this.supervisorForm.markAllAsTouched();
      return;
    }
    const supervisorCollection = this.fs.supervisorCol;
    const supervisorId = this.supervisor
      ? this.supervisor.id
      : this.fs.creasteDocId(supervisorCollection);
    const supervisor: Supervisor<FieldValue> = {
      id: supervisorId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...this.supervisorForm.getRawValue(),
    };
    this.fs.SetSupervisor(supervisor);
    this.dialog.closeAll();
    const message = this.supervisor
      ? 'Superviseur modifié avec succès !'
      : 'Superviseur ajouté avec succès ';

    this.snackbar.open(message, '', { duration: 5000 });
  }
}
