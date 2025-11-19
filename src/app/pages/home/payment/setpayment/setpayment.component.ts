import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { FirestoreService } from '../../../../core/services/firebase/firestore.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AuthService } from '../../../../core/services/firebase/auth.service';
import { User } from '@angular/fire/auth';
import {
  FieldValue,
  serverTimestamp,
  Timestamp,
} from '@angular/fire/firestore';
import { Payment } from '../../../../core/models/payment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dialog } from '@angular/cdk/dialog';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-setpayment',
  imports: [
    MatDivider,
    MatTableModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatDialogActions,
    DatePipe,
  ],
  template: ` <h2 mat-dialog-title>Les payments</h2>
    <table mat-table [dataSource]="payments" class="mat-elevation-z8">
      <ng-container matColumnDef="currency">
        <th mat-header-cell *matHeaderCellDef>Devise</th>
        <td mat-cell *matCellDef="let payment">{{ payment.currency }}</td>
        <td mat-footer-cell *matFooterCellDef></td>
      </ng-container>
      <ng-container matColumnDef="user">
        <th mat-header-cell *matHeaderCellDef>Caissier</th>
        <td mat-cell *matCellDef="let payment">{{ payment.user }}</td>
        <td mat-footer-cell *matFooterCellDef></td>
      </ng-container>
      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef>Date</th>
        <td mat-cell *matCellDef="let payment">
          {{ formatedDate(payment.date) | date : 'mediumDate' }}
        </td>
        <td mat-footer-cell *matFooterCellDef>Total</td>
      </ng-container>

      <ng-container matColumnDef="amount">
        <th mat-header-cell *matHeaderCellDef>Prix</th>
        <td mat-cell *matCellDef="let payment">{{ payment.amount }}</td>
        <td mat-footer-cell *matFooterCellDef>{{ getTotalCost() }}</td>
      </ng-container>
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" colspan="5" align="center">
          Aucune donnée à afficher
        </td>
      </tr>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      <tr mat-footer-row *matFooterRowDef="displayedColumns"></tr>
    </table>

    <mat-divider />
    <mat-dialog-content>
      <form [formGroup]="paymentForm">
        <mat-form-field appearance="outline">
          <mat-label>Montant</mat-label>
          <input
            matInput
            #titleInput
            maxlength="50"
            placeholder="50"
            formControlName="amount"
          />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Devise</mat-label>
          <mat-select formControlName="currency">
            <mat-option value="USD">USD</mat-option>
            <mat-option value="CDF">CDF</mat-option>
          </mat-select>
          @if (paymentForm.controls.currency.hasError('required')) {
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
  table {
  width: 100%;
}

tr.mat-mdc-footer-row td {
  font-weight: bold;
}
mat-form-field{
  margin:0.2rem;
}
  `,
})
export class SetpaymentComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private fs = inject(FirestoreService);
  paymentSub!: Subscription;
  snackBar = inject(MatSnackBar);
  private dialog = inject(Dialog);
  paymentCol = this.fs.paymentCol;
  user$ = this.authService.user;
  intershipId = inject(MAT_DIALOG_DATA);
  payments: Payment<Timestamp>[] = [];
  formatedDate = (t?: Timestamp) => this.fs.formatedTimestamp(t);
  paymentForm = this.fb.nonNullable.group({
    amount: ['', Validators.required],
    currency: ['', Validators.required],
  });
  displayedColumns: string[] = ['amount', 'currency', 'user', 'date'];
  ngOnInit(): void {
    this.paymentSub = this.fs
      .getInternshipPayments(this.intershipId)
      .subscribe((payment) => {
        this.payments = payment as Payment<Timestamp>[];
      });
  }
  getTotalCost() {
    return this.payments
      .map((t) => Number(t.amount))
      .reduce((acc, value) => acc + value, 0);
  }
  onSubmit(user: User | null) {
    const payment: Payment<FieldValue> = {
      id: this.fs.creasteDocId(this.paymentCol(this.intershipId)),
      intershipId: this.intershipId,
      date: serverTimestamp(),
      user: user?.displayName!,
      ...this.paymentForm.getRawValue(),
    };

    this.fs.setPayement(payment, this.intershipId);
    this.snackBar.open('Paiment effectué !', '', { duration: 3000 });
    this.dialog.closeAll();
  }
}
