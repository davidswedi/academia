import { Component, inject, ViewChild } from '@angular/core';
import { HeaderTableActionsComponent } from '../../shared/header-table-actions.component';
import { SetSupervisorComponent } from './set-supervisor/set-supervisor.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Observable, Subscription } from 'rxjs';
import { Supervisor } from '../../../core/models/superviseur.model';
import { Timestamp } from '@angular/fire/firestore';
import { FirestoreService } from '../../../core/services/firebase/firestore.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-supervisor',
  imports: [
    HeaderTableActionsComponent,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatDividerModule,
    MatIconModule,
  ],
  template: `
    <app-header-table-actions
      headerTitle="Superviseur"
      buttonLabel="Nouveu Superviseur"
      [dialogComponent]="setSupervisor"
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
        <table mat-table [dataSource]="datasource" matSort>
          <!-- Position Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>N°</th>
            <td mat-cell *matCellDef="let supervisor">
              {{ datasource.filteredData.indexOf(supervisor) + 1 }}
            </td>
          </ng-container>

          <!-- Title Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
            <td mat-cell *matCellDef="let supervisor">{{ supervisor.name }}</td>
          </ng-container>

          <!-- Possession Column -->
          <ng-container matColumnDef="lastname">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>PostNom</th>
            <td mat-cell *matCellDef="let supervisor">
              {{ supervisor.lastname }}
            </td>
          </ng-container>

          <!-- Contributors Column -->
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Fonction</th>
            <td mat-cell *matCellDef="let supervisor">
              {{ supervisor.title }}
            </td>
          </ng-container>
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Phone</th>
            <td mat-cell *matCellDef="let supervisor">
              {{ supervisor.phone }}
            </td>
          </ng-container>
          <ng-container matColumnDef="specialisation">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Specialité
            </th>
            <td mat-cell *matCellDef="let supervisor">
              {{ supervisor.specialisation }}
            </td>
          </ng-container>
          <!-- Action Column -->
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
            <td mat-cell *matCellDef="let supervisor">
              <button (click)="OnEditSupervisor(supervisor)" mat-icon-button>
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="OnDeleteSupervisor(supervisor)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr
            mat-header-row
            *matHeaderRowDef="displayedColumns"
            style="font-weight: bolder"
          ></tr>
          <tr
            mat-row
            *matRowDef="let supervisor; columns: displayedColumns"
          ></tr>

          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="5" align="center">
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
  styles: ``,
})
export default class SupervisorComponent {
  setSupervisor = SetSupervisorComponent;
  datasource = new MatTableDataSource<Supervisor<Timestamp>>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private dialog = inject(MatDialog);
  private fs = inject(FirestoreService);
  supervisors$!: Observable<Supervisor<Timestamp[]>>;
  subscription!: Subscription;
  displayedColumns: String[] = [
    'id',
    'name',
    'lastname',
    'title',
    'specialisation',
    'phone',
    'action',
  ];

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  ngOnInit() {
    this.subscription = this.fs.getSupervisors().subscribe((superivors) => {
      this.datasource.data = superivors as Supervisor<Timestamp>[];
    });
  }
  OnEditSupervisor(supervisor: Supervisor<Timestamp>) {
    this.dialog.open(SetSupervisorComponent, {
      width: '32rem',
      data: supervisor,
      autoFocus: true,
    });
  }
  OnDeleteSupervisor(supervisor: Supervisor<Timestamp>) {
    this.fs.deleteData(this.fs.supervisorCol, supervisor.id);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();

    if (this.datasource.paginator) {
      this.datasource.paginator.firstPage();
    }
  }
}
