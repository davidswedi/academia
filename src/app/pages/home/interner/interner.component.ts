import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderTableActionsComponent } from '../../shared/header-table-actions.component';
import { SetInternerComponent } from './set-interner/set-interner.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { Interner } from '../../../core/models/stagiaire.model';
import { Timestamp } from '@angular/fire/firestore';
import { MatDividerModule } from '@angular/material/divider';
import { FirestoreService } from '../../../core/services/firebase/firestore.service';
import { MatSort } from '@angular/material/sort';
import { Observable, Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-interner',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    HeaderTableActionsComponent,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
  ],
  template: `
    <app-header-table-actions
      headerTitle="Stagiaire"
      buttonLabel="Nouveu Stagiaire"
      [dialogComponent]="setInterner"
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
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>N°</th>
            <td mat-cell *matCellDef="let interner">
              {{ dataSource.filteredData.indexOf(interner) + 1 }}
            </td>
          </ng-container>

          <!-- Title Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
            <td mat-cell *matCellDef="let interner">{{ interner.name }}</td>
          </ng-container>

          <!-- Possession Column -->
          <ng-container matColumnDef="lastname">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>PostNom</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.lastname }}
            </td>
          </ng-container>

          <!-- Contributors Column -->
          <ng-container matColumnDef="gender">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Sexe</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.gender }}
            </td>
          </ng-container>
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Phone</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.phone }}
            </td>
          </ng-container>
          <ng-container matColumnDef="college">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Institution
            </th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.college }}
            </td>
          </ng-container>
          <ng-container matColumnDef="promotion">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Promotion</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.promotion }}
            </td>
          </ng-container>
          <ng-container matColumnDef="departement">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Departement
            </th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.departement }}
            </td>
          </ng-container>
          <!-- Action Column -->
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
            <td mat-cell *matCellDef="let interner">
              <button (click)="OnEditInterner(interner)" mat-icon-button>
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="OnDeleteInterner(interner)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr
            mat-header-row
            *matHeaderRowDef="displayedColumns"
            style="font-weight: bolder"
          ></tr>
          <tr mat-row *matRowDef="let project; columns: displayedColumns"></tr>

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
          aria-label="Séléctionnez la page des projets"
        ></mat-paginator>
      </div>
    </main>
  `,
  styles: ``,
})
export default class InternerComponent {
  setInterner = SetInternerComponent;
  dataSource = new MatTableDataSource<Interner<Timestamp>>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private fs = inject(FirestoreService);
  subscription?: Subscription;
  dialog = inject(MatDialog);
  projects$?: Observable<Interner<Timestamp>[]>;
  formatedDate = (t?: Timestamp) => this.fs.formatedTimestamp(t);
  displayedColumns: string[] = [
    'id',
    'name',
    'lastname',
    'gender',
    'phone',
    'college',
    'promotion',
    'departement',
    'action',
  ];
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this.subscription = this.fs.getInterners().subscribe((interners) => {
      this.dataSource.data = interners as Interner<Timestamp>[];
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  OnEditInterner(interner: Interner<Timestamp>) {
    this.dialog.open(SetInternerComponent, {
      width: '35rem',
      disableClose: true,
      data: interner,
    });
    console.log(interner);
  }
  OnDeleteInterner(interner: Interner<Timestamp>) {
    this.fs.deleteData(this.fs.internerCol, interner.id);
  }
}
