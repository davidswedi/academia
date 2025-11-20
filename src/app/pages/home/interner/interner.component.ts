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
import { ActionValidationComponent } from '../../shared/action-validation.component';
import { ExportExcelService } from '../../../core/services/utilities/export.excel.service';
import { TitleCasePipe } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { IS_MEDIUM } from '../../../app.constants';
import { WindowsObserverService } from '../../../core/services/utilities/windows-observer.service';

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
    TitleCasePipe,
  ],
  template: `
    <div class="div-header">
      <app-header-table-actions
        headerTitle="Stagiaire"
        buttonLabel="Nouveu Stagiaire"
        [dialogComponent]="setInterner"
        filName="fileName"
      ></app-header-table-actions>
      @if (viewPort() >= mediumWidth) {
      <button mat-icon-button (click)="exportExcel()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0 0 48 48"
        >
          <path
            fill="#169154"
            d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"
          ></path>
          <path
            fill="#18482a"
            d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"
          ></path>
          <path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path>
          <path fill="#17472a" d="M14 24.005H29V33.055H14z"></path>
          <g>
            <path
              fill="#29c27f"
              d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"
            ></path>
            <path
              fill="#27663f"
              d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"
            ></path>
            <path
              fill="#19ac65"
              d="M29 15.003H44V24.005000000000003H29z"
            ></path>
            <path fill="#129652" d="M29 24.005H44V33.055H29z"></path>
          </g>
          <path
            fill="#0c7238"
            d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"
          ></path>
          <path
            fill="#fff"
            d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"
          ></path>
        </svg>
      </button>
      }
    </div>

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
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.name }}
            </td>
          </ng-container>
          <ng-container matColumnDef="lastname">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>PostNom</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.lastname }}
            </td>
          </ng-container>

          <ng-container matColumnDef="gender">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Sexe</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.gender }}
            </td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Télephone</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.phone }}
            </td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
            <td mat-cell *matCellDef="let interner">
              {{ interner.email }}
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
                    <div>
                      <h2>
                        {{ element.name }} - {{ element.lastname }} -
                        {{ element.firstname }}
                      </h2>
                      <h3>
                        {{ element.gender | titlecase }} - {{ element.phone }}
                      </h3>
                      <p>
                        {{ element.departement }} - {{ element.promotion }} -
                        {{ element.college }}
                      </p>
                    </div>
                    <div>
                      <button (click)="OnEditInterner(element)" mat-icon-button>
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button
                        mat-icon-button
                        (click)="
                          callActionValidationComponent(internerCol, element.id)
                        "
                      >
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
export default class InternerComponent {
  setInterner = SetInternerComponent;
  mediumWidth = IS_MEDIUM;
  viewPort = inject(WindowsObserverService).width;
  dataSource = new MatTableDataSource<Interner<Timestamp>>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private fs = inject(FirestoreService);
  private es = inject(ExportExcelService);
  internerCol = this.fs.internerCol;
  subscription?: Subscription;
  dialog = inject(MatDialog);
  projects$?: Observable<Interner<Timestamp>[]>;
  actionComponent = ActionValidationComponent;
  formatedDate = (t?: Timestamp) => this.fs.formatedTimestamp(t);
  fileName = 'listeStagiaire.xlsx';
  displayedColumns: string[] = ['id', 'name', 'gender', 'phone'];
  private bo = inject(BreakpointObserver);
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this.subscription = this.fs.getInterners().subscribe((interners) => {
      this.dataSource.data = interners as Interner<Timestamp>[];
    });
    // Use CDK BreakpointObserver to switch visible columns on small screens
    this.bo.observe([Breakpoints.Handset]).subscribe((state) => {
      if (state.matches) {
        // small screens: show only Nom, PostNom, Sexe
        this.columnsToDisplay = ['name', 'lastname', 'gender'];
      } else {
        // larger screens: show full set
        this.columnsToDisplay = [
          'id',
          'lastname',
          'name',
          'gender',
          'phone',
          'email',
        ];
      }
      this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
    });
  }

  columnsToDisplay = ['id', 'name', 'gender', 'phone'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: PeriodicElement | null;

  /** Checks whether an element is expanded. */
  isExpanded(element: PeriodicElement) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element: PeriodicElement) {
    this.expandedElement = this.isExpanded(element) ? null : element;
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
  exportExcel() {
    this.es.exportexcel(this.fileName);
  }
}
export interface PeriodicElement {
  name: string;
  lastname: string;
  departement: string;
  gender: string;
  phone: string;
  college: string;
}
