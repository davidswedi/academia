import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HeaderTableActionsComponent } from '../../shared/header-table-actions.component';
import { ActionValidationComponent } from '../../shared/action-validation.component';
import { SetmoduleComponent } from './setmodule/setmodule.component';
import { FirestoreService } from '../../../core/services/firebase/firestore.service';
import { TrainingModule } from '../../../core/models/module.model';
import { FieldValue, Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-learningmodules',
  imports: [
    CommonModule,
    HeaderTableActionsComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatDialogModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  template: `
    <app-header-table-actions
      headerTitle="Modules de Formation"
      buttonLabel="Nouveau Module"
      [dialogComponent]="setModule"
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
        <table
          mat-table
          [dataSource]="dataSource"
          multiTemplateDataRows
          matSort
          class="mat-elevation-z8"
        >
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>N°</th>
            <td mat-cell *matCellDef="let interner">
              {{ dataSource.filteredData.indexOf(interner) + 1 }}
            </td>
          </ng-container>
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Titre</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.title }}
            </td>
          </ng-container>
          <ng-container matColumnDef="level">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Niveau</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.level }}
            </td>
          </ng-container>

          <ng-container matColumnDef="tarrif">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Tarrif</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.tarrif }}
            </td>
          </ng-container>
          <ng-container matColumnDef="duration">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Duréé</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.duration }}
            </td>
          </ng-container>

          <ng-container matColumnDef="expand">
            <th mat-header-cell *matHeaderCellDef aria-label="row actions">
              &nbsp;
            </th>
            <td mat-cell *matCellDef="let element">
              <button
                mat-icon-button
                aria-label="expand row"
                (click)="toggle(element); $event.stopPropagation()"
                class="example-toggle-button"
                [class.example-toggle-button-expanded]="isExpanded(element)"
              >
                <mat-icon>keyboard_arrow_down</mat-icon>
              </button>
            </td>
          </ng-container>

          <!-- Expanded Content Column - The detail row is made up of this one column that spans across all columns -->
          <ng-container matColumnDef="expandedDetail">
            <td
              mat-cell
              *matCellDef="let element"
              [attr.colspan]="columnsToDisplayWithExpand.length"
            >
              <div
                class="example-element-detail-wrapper"
                [class.example-element-detail-wrapper-expanded]="
                  isExpanded(element)
                "
              >
                <div class="example-element-detail">
                  <div class="example-element-description">
                    <div class="detail-content">
                      <h3>{{ element.title }}</h3>
                      <p>
                        <strong>Description:</strong> {{ element.description }}
                      </p>
                      <p>
                        <strong>Objectifs:</strong>
                        {{ (element.objectives || []).join(', ') }}
                      </p>
                      <p>
                        <strong>Prérequis:</strong>
                        {{ (element.requirements || []).join(', ') || 'Aucun' }}
                      </p>
                      <p>
                        <strong>Sections:</strong>
                        {{ (element.content || []).length }}
                      </p>
                    </div>
                    <div>
                      <button mat-icon-button>
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button>
                        <mat-icon class="alert-action">delete</mat-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columnsToDisplayWithExpand"></tr>
          <tr
            mat-row
            *matRowDef="let element; columns: columnsToDisplayWithExpand"
            class="example-element-row"
            [class.example-expanded-row]="isExpanded(element)"
            (click)="toggle(element)"
          ></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: ['expandedDetail']"
            class="example-detail-row"
          ></tr>
        </table>

        <mat-divider />
        <mat-paginator
          [pageSizeOptions]="[5, 10, 25, 100]"
          aria-label="Séléctionnez la page des projets"
        ></mat-paginator>
      </div>
    </main>
  `,
  styles: `
    .div-header{
    display:flex;
    align-items:center;
    gap:2rem;
    app-header-table-actions{
      width:90%;
    }
  }
  table {
  width:80%;
}

tr.example-detail-row {
  height: 0;
}

tr.example-element-row {
  cursor: pointer;
}

tr.example-element-row:not(.example-expanded-row):hover {
  background: whitesmoke;
}

tr.example-element-row:not(.example-expanded-row):active {
  background: #efefef;
}

.example-element-row td {
  border-bottom-width: 0;
}

.example-element-detail-wrapper {
  overflow: hidden;
  display: grid;
  grid-template-rows: 0fr;
  grid-template-columns: 100%;
  transition: grid-template-rows 225ms cubic-bezier(0.4, 0, 0.2, 1);
}

.example-element-detail-wrapper-expanded {
  grid-template-rows: 1fr;
}

.example-element-detail {
  display: flex;
  min-height: 0;
}

.example-element-diagram {
  min-width: 80px;
  border: 2px solid black;
  padding: 8px;
  font-weight: lighter;
  margin: 8px 0;
  height: 104px;
}

.example-element-symbol {
  font-weight: bold;
  font-size: 40px;
  line-height: normal;
}

.example-element-description {
  padding: 16px;
}

.example-element-description-attribution {
  opacity: 0.5;
}

.example-toggle-button {
  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1);
}

.example-toggle-button-expanded {
  transform: rotate(180deg);
}
  `,
})
export default class LearningmodulesComponent {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private fs = inject(FirestoreService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private breakpointObserver = inject(BreakpointObserver);

  setModule = SetmoduleComponent;
  dataSource = new MatTableDataSource<TrainingModule<Timestamp>>();
  columnsToDisplay = ['id', 'title', 'level', 'duration', 'tarrif'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: PeriodicElement | null;

  ngOnInit() {
    this.fs.getTrainingModules().subscribe((modules) => {
      this.dataSource.data = modules as TrainingModule<Timestamp>[];
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // private setupResponsiveColumns() {
  //   this.breakpointObserver
  //     .observe([Breakpoints.Handset, Breakpoints.Tablet])
  //     .subscribe((result) => {
  //       if (result.matches) {
  //         this.columnsToDisplay = ['id', 'title', 'expand'];
  //       } else {
  //         this.columnsToDisplay = [
  //           'id',
  //           'title',
  //           'level',
  //           'duration',
  //           'tarrif',
  //           'expand',
  //         ];
  //       }
  //     });
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isExpanded(element: PeriodicElement) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element: PeriodicElement) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }
}
export interface PeriodicElement {
  id: string;
  title: string;
  level: string;
  tarif: string;
}
