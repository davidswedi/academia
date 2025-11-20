import { Observable, Subscription } from 'rxjs';
import { Component, inject, ViewChild } from '@angular/core';
import { HeaderTableActionsComponent } from '../../shared/header-table-actions.component';
import { SetInternshipComponent } from './set-internship/set-internship.component';
import { Internship } from '../../../core/models/stage.model';
import { FieldValue, Timestamp } from '@angular/fire/firestore';
import { FirestoreService } from '../../../core/services/firebase/firestore.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActionValidationComponent } from '../../shared/action-validation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-internship',
  standalone: true,
  imports: [
    HeaderTableActionsComponent,
    MatTableModule,
    MatInputModule,
    MatDivider,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    DatePipe,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header-table-actions
      headerTitle="Stage"
      buttonLabel="Nouvelle Affectation "
      [dialogComponent]="setIntership"
    ></app-header-table-actions>

    <main style="margin:1rem">
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
              <th mat-header-cell *matHeaderCellDef mat-sort-header>
                Stagiaire
              </th>
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
              <th mat-header-cell *matHeaderCellDef mat-sort-header>
                Encadreur
              </th>
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
              <button (click)="OnEditSupervisor(intership)" mat-icon-button>
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                (click)="
                  callActionValidationComponent(intership.id, internshipCol)
                "
              >
                <mat-icon class="alert-action">delete</mat-icon>
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
          <tr
            mat-row
            *matRowDef="let intership; columns: displayedColumns"
          ></tr>

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
    </main>
  `,
  styles: `
  mat-form-field{
    width:49%;
    margin:0 2px;
  }
  /* Make form fields full width on small screens */
 
  table{
    width:100%;
  }
  span{
    cursor:pointer;
  }
  `,
})
export default class InternshipComponent {
  setIntership = SetInternshipComponent;
  actionComponent = ActionValidationComponent;
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
    // Observe handset breakpoint and switch visible columns on small screens
    this.bo.observe([Breakpoints.Handset]).subscribe((state) => {
      if (state.matches) {
        // small screens: show only interner (name), supervisor and actions
        this.displayedColumns = ['interner', 'supervisor', 'action'];
      } else {
        // larger screens: full set
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
  OnEditSupervisor(intership: Internship<Timestamp>) {
    this.dialog.open(this.setIntership, {
      width: '35rem',
      disableClose: true,
      data: intership,
    });
  }

  callActionValidationComponent(docId: string, colName: string) {
    this.dialog.open(this.actionComponent, {
      width: '32rem',
      disableClose: true,
      data: {
        docId,
        colName,
      },
    });
  }
}
