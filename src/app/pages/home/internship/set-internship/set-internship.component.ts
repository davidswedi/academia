import { Payment } from './../../../../core/models/payment.model';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FirestoreService } from '../../../../core/services/firebase/firestore.service';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { Interner } from '../../../../core/models/stagiaire.model';
import {
  FieldValue,
  serverTimestamp,
  Timestamp,
} from '@angular/fire/firestore';
import { Supervisor } from '../../../../core/models/superviseur.model';
import { Internship } from '../../../../core/models/stage.model';
import { Dialog } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/firebase/auth.service';
import { User } from '@angular/fire/auth';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-set-internship',
  imports: [
    MatDialogModule,
    MatDividerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  template: ` <h2 mat-dialog-title>Nouvelle Affectation</h2>
    <mat-divider />
    <mat-dialog-content>
      <form [formGroup]="internershipForm">
        <mat-form-field appearance="outline">
          <mat-label>Nom Stagiaire</mat-label>
          <input
            type="text"
            placeholder="Selectionner"
            aria-label="Stagiaire"
            matInput
            formControlName="internerId"
            [matAutocomplete]="auto"
          />
          <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
            @for (option of filteredOptions | async; track option) {
            <mat-option [value]="option.name"
              >{{ option.name }} {{ option.lastname }}</mat-option
            >
            }
          </mat-autocomplete>
          @if (internershipForm.controls.internerId.hasError('required')) {
          <mat-error>Veuillez préciser un nom</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Departement</mat-label>
          <mat-select formControlName="departement">
            <mat-option value="Bureautique">Bureautique</mat-option>
            <mat-option value="Vsat">VSAT</mat-option>
            <mat-option value="Réseaux et Télécommunication"
              >Réseaux et Télécommunication</mat-option
            >
            <mat-option value="Genie Logiciel">Genie Logiciel</mat-option>
            <mat-option value="Linux">Linux</mat-option>
          </mat-select>
          @if (internershipForm.controls.departement.hasError('required')) {
          <mat-error>Veuillez préciser une specialité</mat-error>
          }
        </mat-form-field>
        <mat-form-field>
          <mat-label>Periode de Stage</mat-label>
          <mat-date-range-input formGroupName="range" [rangePicker]="picker">
            <input
              matStartDate
              formControlName="startDate"
              placeholder="Debut Stage"
            />
            <input
              matEndDate
              formControlName="endDate"
              placeholder="Fin stage"
            />
          </mat-date-range-input>
          <mat-hint>MM/DD/YYYY – MM/DD/YYYY</mat-hint>
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>

          @if
          (internershipForm.get('range.startDate')?.hasError('matStartDateInvalid'))
          {
          <mat-error>Invalid start date</mat-error>
          } @if
          (internershipForm.get('range.startDate')?.hasError('matEndDateInvalid'))
          {
          <mat-error>Invalid end date</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Superviseur</mat-label>
          <mat-select formControlName="supervisor">
            @for (supervisor of supervisors; track $index) {
            <mat-option [value]="supervisor.name"
              >{{ supervisor.name }} {{ supervisor.lastname }}</mat-option
            >
            }
          </mat-select>
          @if (internershipForm.controls.internerId.hasError('required')) {
          <mat-error>Veuillez préciser un nom</mat-error>
          }
        </mat-form-field>
        <fieldset>
          <mat-form-field appearance="outline">
            <mat-label>Frais Inscription</mat-label>
            <input
              matInput
              #titleInput
              maxlength="50"
              placeholder="50"
              formControlName="registrationFee"
            />
            <mat-hint align="end">{{ titleInput.value.length }}/50</mat-hint>

            @if (internershipForm.controls.registrationFee.hasError('required'))
            {
            <mat-error>Entrez un montant valide</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Devise</mat-label>
            <mat-select formControlName="currency">
              <mat-option value="USD">USD</mat-option>
              <mat-option value="CDF">CDF</mat-option>
            </mat-select>
            @if (internershipForm.controls.intershipType.hasError('required')) {
            <mat-error>Faites un choix</mat-error>
            }
          </mat-form-field>
        </fieldset>
        <mat-form-field appearance="outline">
          <mat-label>Type de Stage</mat-label>
          <mat-select formControlName="intershipType">
            <mat-option value="stage">Stage</mat-option>
            <mat-option value="formaton">Formation</mat-option>
          </mat-select>
          @if (internershipForm.controls.intershipType.hasError('required')) {
          <mat-error>Faites un choix</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-divider />

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      @let user = user$ | async ;
      <button mat-flat-button (click)="onSubmit(user)">Enregistrer</button>
    </mat-dialog-actions>`,
  styles: `
   mat-form-field{
    width:49%;
    margin:0 2px;
  }
  `,
})
export class SetInternshipComponent {
  private fb = inject(FormBuilder);
  private fs = inject(FirestoreService);
  interners: Interner<Timestamp>[] = [];
  supervisors!: Supervisor<Timestamp>[];
  supervisorSub!: Subscription;
  studentsSub!: Subscription;
  filteredOptions!: Observable<Interner<Timestamp>[]>;
  intership = inject<Internship<FieldValue | undefined>>(MAT_DIALOG_DATA);
  internshipCol = this.fs.intershipCol;
  dialog = inject(Dialog);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  user$ = this.authService.user;
  internershipForm = this.fb.nonNullable.group({
    internerId: ['', Validators.required],
    departement: ['', Validators.required],
    supervisor: ['', Validators.required],
    range: this.fb.nonNullable.group({
      startDate: new FormControl<Date>(new Date(), Validators.required),
      endDate: new FormControl<Date>(new Date(), Validators.required),
    }),
    intershipType: ['', Validators.required],
    currency: ['', Validators.required],
    registrationFee: ['', Validators.required],
  });

  ngOnInit() {
    if (this.intership) {
      this.internershipForm.patchValue({
        internerId: this.intership.internerId,
        departement: this.intership.departement,
        supervisor: this.intership.supervisor,
        intershipType: this.intership.intershipType,
        registrationFee: this.intership.registrationFee,
      });
    }
    this.studentsSub = this.fs.getInterners().subscribe((interners) => {
      this.interners = interners as Interner<Timestamp>[];
    });
    this.supervisorSub = this.fs.getSupervisors().subscribe((supervisors) => {
      this.supervisors = supervisors as Supervisor<Timestamp>[];
    });
    this.filteredOptions = this.internershipForm
      .get('internerId')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
  }
  private _filter(value: string): Interner<Timestamp>[] {
    const filterValue = value.toLowerCase();

    return this.interners.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  onSubmit(user: User | null) {
    if (this.internershipForm.invalid) {
      this.internershipForm.markAllAsTouched();

      return;
    }
    const internShip: Internship<FieldValue> = {
      id: this.intership
        ? this.intership.id
        : this.fs.creasteDocId(this.internshipCol),
      internerId: this.internershipForm.getRawValue().internerId,
      departement: this.internershipForm.getRawValue().departement,
      range: {
        startDate: Timestamp.fromDate(
          this.internershipForm.getRawValue().range.startDate ?? new Date()
        ),
        endDate: Timestamp.fromDate(
          this.internershipForm.getRawValue().range.endDate ?? new Date()
        ),
      },
      supervisor: this.internershipForm.getRawValue().supervisor,
      intershipType: this.internershipForm.getRawValue().intershipType,
      registrationFee: this.internershipForm.getRawValue().registrationFee,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    this.fs.setIntership(internShip);
    this.dialog.closeAll();

    const message = this.intership
      ? 'Modificatio réussie !'
      : 'Affactation effectuée avec succès !';

    this.snackBar.open(message, '', { duration: 5000 });
  }
  ngOnDestroy() {
    this.supervisorSub.unsubscribe();
    this.studentsSub.unsubscribe();
  }
}
