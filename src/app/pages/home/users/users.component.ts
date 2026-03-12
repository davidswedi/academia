import { Component, inject, ViewChild } from '@angular/core';
import { HeaderTableActionsComponent } from '../../shared/header-table-actions.component';
import { SetUserComponent } from './set-user/set-user.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../../core/services/firebase/firestore.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActionValidationComponent } from '../../shared/action-validation.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [
    HeaderTableActionsComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    DatePipe,
  ],
  template: `
    <app-header-table-actions
      headerTitle="Utilisateurs"
      buttonLabel="Nouvel Utilisateur"
      [dialogComponent]="setUser"
    ></app-header-table-actions>

    <main style="margin:1rem">
      <mat-form-field style="width:100%;">
        <mat-label>Filtrer</mat-label>
        <input
          matInput
          (keyup)="applyFilter($event)"
          placeholder="Ex. Dupont"
          #input
        />
      </mat-form-field>

      <div class="table-container">
        <table
          mat-table
          [dataSource]="dataSource"
          matSort
          class="mat-elevation-z8"
        >
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>N°</th>
            <td mat-cell *matCellDef="let user">
              {{ dataSource.filteredData.indexOf(user) + 1 }}
            </td>
          </ng-container>

          <ng-container matColumnDef="fullName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Nom complet
            </th>
            <td mat-cell *matCellDef="let user">{{ user.fullName }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
            <td mat-cell *matCellDef="let user">{{ user.role }}</td>
          </ng-container>

          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Créé le</th>
            <td mat-cell *matCellDef="let user">
              {{ formatDate(user.createdAt) | date : 'dd/MM/yyyy' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef aria-label="row actions">
              &nbsp;
            </th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button (click)="openEdit(user)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteUser(user)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

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

        <mat-divider></mat-divider>
        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]"></mat-paginator>
      </div>
    </main>
  `,
  styles: `
    .table-container { width:100%; }
  `,
})
export class UsersComponent {
  setUser = SetUserComponent;
  private fs = inject(FirestoreService);
  private dialog = inject(MatDialog);
  private bo = inject(BreakpointObserver);
  private snackBar = inject(MatSnackBar);

  dataSource = new MatTableDataSource<any>([]);
  subscription!: Subscription;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'fullName',
    'email',
    'role',
    'createdAt',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.subscription = this.fs.getUsers().subscribe((users) => {
      this.dataSource.data = users as any[];
    });

    // responsive columns: show only fullName, email, action on small screens (handset OR tablet)
    this.bo.observe([Breakpoints.Handset]).subscribe((s) => {
      if (s.matches) {
        // small screens: only name and email
        this.displayedColumns = ['fullName', 'email'];
      } else {
        this.displayedColumns = [
          'id',
          'fullName',
          'email',
          'role',
          'createdAt',
          'action',
        ];
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  openEdit(user: any) {
    this.dialog.open(SetUserComponent, { width: '32rem', data: user });
  }

  deleteUser(user: any) {
    if (!user?.id) return;
    const ref = this.dialog.open(ActionValidationComponent, {
      width: '32rem',
      data: { docId: user.id, colName: this.fs.userCol },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      const deleted = { ...user };
      // perform deletion
      this.fs.deleteData(this.fs.userCol, user.id);

      // show undo snackbar
      const snack = this.snackBar.open('Suppression réussie', 'Annuler', {
        duration: 5000,
      });
      snack.onAction().subscribe(() => {
        // restore user
        this.fs.setUser(deleted as any);
      });
    });
  }

  formatDate(value: any) {
    if (!value) return '';
    if (value?.seconds) return new Date(value.seconds * 1000);
    return new Date(value);
  }
}
