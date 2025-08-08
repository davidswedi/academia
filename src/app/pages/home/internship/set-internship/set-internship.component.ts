import { Component } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
@Component({
  selector: 'app-set-internship',
  imports: [MatDialogModule],
  template: ` <p>set-internship works!</p> `,
  styles: `
  .contributor-form {
      display: flex;
      gap: 1rem;

      & > mat-form-field {
        flex: 2;
      }
    }
  `,
})
export class SetInternshipComponent {}
