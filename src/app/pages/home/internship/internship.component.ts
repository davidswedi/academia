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
          <!-- Action Column -->
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
            <td mat-cell *matCellDef="let intership">
              <button (click)="OnEditSupervisor(intership)" mat-icon-button>
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="OnEditSupervisor(intership)">
                <mat-icon>delete</mat-icon>
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

      <mat-accordion>
        <mat-expansion-panel hideToggle>
          <mat-expansion-panel-header>
            <mat-panel-title> This is the expansion title </mat-panel-title>
            <mat-panel-description>
              This is a summary of the content
            </mat-panel-description>
          </mat-expansion-panel-header>
          <p>This is the primary content of the panel.</p>
        </mat-expansion-panel>
        <mat-expansion-panel
          (opened)="panelOpenState.set(true)"
          (closed)="panelOpenState.set(false)"
        >
          <mat-expansion-panel-header>
            <mat-panel-title> Self aware panel </mat-panel-title>
            <mat-panel-description>
              Currently I am {{ panelOpenState() ? 'open' : 'closed' }}
            </mat-panel-description>
          </mat-expansion-panel-header>
          <p>I'm visible because I am open</p>
        </mat-expansion-panel>
      </mat-accordion>
    </main>
  `,
  styles: ``,
})
export default class InternshipComponent {
  readonly panelOpenState = signal(false);
  applyFilter($event: KeyboardEvent) {
    throw new Error('Method not implemented.');
  }
  OnEditSupervisor(_t88: any) {
    throw new Error('Method not implemented.');
  }
  setIntership = SetInternshipComponent;

  private fs = inject(FirestoreService);
  intership!: Observable<Internship<Timestamp[]>>;
  dataSource = new MatTableDataSource<Internship<FieldValue>>();
  subscription!: Subscription;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private dialog = inject(MatDialog);

  displayedColumns: String[] = [
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
      console.log(intership);
    });
  }
}
