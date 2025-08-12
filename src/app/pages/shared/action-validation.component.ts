import { Component, inject } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Internship } from '../../core/models/stage.model';
import { Timestamp } from 'rxjs';
import { FirestoreService } from '../../core/services/firebase/firestore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dialog } from '@angular/cdk/dialog';
@Component({
  selector: 'app-action-validation',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Suppression des données</h2>

    <mat-dialog-content>
      <div>
        <mat-icon class="alert-action">warning</mat-icon>
        <h4 class="alert-action">
          Si vous confirmez l'affectation sera définitivement supprimée
        </h4>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button class="action-button" (click)="OnDeleteData()">
        Supprimer
      </button>
    </mat-dialog-actions>
  `,
  styles: `
  span{
    color:var(--mat-sys-error)
  }
  .action-button{
  background-color:var(--mat-sys-on-error-container)
  }
  div{
    display:flex;
    align-items:center;
    gap:0.8rem;
    background-color:var(--mat-sys-error-container);
    padding:0.2rem; 
    border-radius:0.7rem;
    
  }
  `,
})
export class ActionValidationComponent {
  data = inject(MAT_DIALOG_DATA);
  fs = inject(FirestoreService);
  snackBar = inject(MatSnackBar);
  dialog = inject(Dialog);
  OnDeleteData() {
    this.fs.deleteData(this.data.colName, this.data.docId);
    this.snackBar.open('Suppression réussie !', '', { duration: 3000 });
    this.dialog.closeAll();
  }
}
