import { Component, inject, ViewChild } from '@angular/core';
import { HeaderTableActionsComponent } from '../../shared/header-table-actions.component';
import { ComponentType } from '@angular/cdk/overlay';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { Internship } from '../../../core/models/stage.model';
import { FieldValue, Timestamp } from '@angular/fire/firestore';
import { FirestoreService } from '../../../core/services/firebase/firestore.service';
import { Observable, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SetpaymentComponent } from './setpayment/setpayment.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-payment',
  imports: [
    MatTableModule,
    MatInputModule,
    MatDivider,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    DatePipe,
  ],
  template: ` <main style="margin:1rem">
    <mat-form-field style="width:100%;">
      <mat-label>Filtrer</mat-label>
      <input
        matInput
        (keyup)="applyFilter($event)"
        placeholder="Ex. David Swedi Olivia"
        #input
      />
    </mat-form-field>
    <div class="table-container">
      <table mat-table [dataSource]="dataSource" matSort>
        <!-- Position Column -->
        <span routerLink="/">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>N°</th>
            <td mat-cell *matCellDef="let intership">
              {{ dataSource.filteredData.indexOf(intership) + 1 }}
            </td>
          </ng-container>

          <!-- Title Column -->
          <ng-container matColumnDef="interner">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Stagiaire</th>
            <td mat-cell *matCellDef="let intership">
              {{ intership.internerId }}
            </td>
          </ng-container>

          <!-- Possession Column -->
          <ng-container matColumnDef="departement">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Departement
            </th>
            <td mat-cell *matCellDef="let intership">
              {{ intership.departement }}
            </td>
          </ng-container>

          <!-- Contributors Column -->
          <ng-container matColumnDef="supervisor">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Encadreur</th>
            <td mat-cell *matCellDef="let intership">
              {{ intership.supervisor }}
            </td>
          </ng-container>
          <ng-container matColumnDef="startDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Debut</th>
            <td mat-cell *matCellDef="let intership">
              {{
                intership.range.startDate.seconds * 1000 +
                  intership.range.startDate.nanoseconds / 1000000
                  | date : 'dd/MM/yyyy'
              }}
            </td>
          </ng-container>
          <ng-container matColumnDef="endDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Fin</th>
            <td mat-cell *matCellDef="let intership">
              {{
                intership.range.endDate.seconds * 1000 +
                  intership.range.endDate.nanoseconds / 1000000
                  | date : 'dd/MM/yyyy'
              }}
            </td>
          </ng-container>
        </span>
        <!-- Action Column -->
        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
          <td mat-cell *matCellDef="let intership">
            <button mat-button (click)="onPaymentAction(intership.id)">
              Payement
            </button>
          </td>
        </ng-container>

        <tr
          mat-header-row
          *matHeaderRowDef="displayedColumns"
          style="font-weight: bolder"
        ></tr>
        <!-- <tr
            mat-header-row
            *matHeaderRowDef="displayedColumns"
            style="font-weight: bolder"
          ></tr> -->
        <tr mat-row *matRowDef="let intership; columns: displayedColumns"></tr>

        <!-- Row shown when there is no matching data. -->
        <tr class="mat-row" *matNoDataRow>
          <td
            class="mat-cell"
            [attr.colspan]="displayedColumns.length"
            align="center"
          >
            Aucune donnée à afficher
          </td>
        </tr>
      </table>
      <mat-divider />
      <mat-paginator
        [pageSizeOptions]="[5, 10, 25, 100]"
        aria-label="Séléctionnez la page des superviseurs"
      ></mat-paginator>
    </div>
  </main>`,
  styles: ``,
})
export default class PaymentComponent {
  setIntership!: ComponentType<unknown>;

  private fs = inject(FirestoreService);
  private bo = inject(BreakpointObserver);
  intership!: Observable<Internship<Timestamp[]>>;
  dataSource = new MatTableDataSource<Internship<FieldValue>>();
  subscription!: Subscription;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private dialog = inject(MatDialog);
  internshipCol = this.fs.intershipCol;
  private snackBar = inject(MatSnackBar);
  newPayment = SetpaymentComponent;
  displayedColumns: string[] = [
    'id',
    'interner',
    'departement',
    'supervisor',
    'startDate',
    'endDate',
    'action',
  ];
  ngOnInit() {
    this.subscription = this.fs.getInterships().subscribe((intership) => {
      this.dataSource.data = intership as Internship<Timestamp>[];
    });
    // switch visible columns on handset (mobile) using CDK BreakpointObserver
    this.bo.observe([Breakpoints.Handset]).subscribe((state) => {
      if (state.matches) {
        // small screens: show interner, departement and action
        this.displayedColumns = ['interner', 'departement', 'action'];
      } else {
        this.displayedColumns = [
          'id',
          'interner',
          'departement',
          'supervisor',
          'startDate',
          'endDate',
          'action',
        ];
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPaymentAction(intershipId: string) {
    this.dialog.open(this.newPayment, {
      width: '32rem',
      disableClose: true,
      data: intershipId,
    });
  }
}
