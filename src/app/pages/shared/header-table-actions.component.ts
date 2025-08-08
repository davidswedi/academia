import { Component, inject, Input, input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-header-table-actions',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <header
      style="display: flex; justify-content: space-between; align-items: center; margin: 0 1rem"
    >
      <h2>{{ headerTitle() }}</h2>
      <button mat-flat-button (click)="onNewInterner()">
        {{ buttonLabel() }}
      </button>
    </header>
  `,
  styles: ``,
})
export class HeaderTableActionsComponent {
  private dialog = inject(MatDialog);
  headerTitle = input.required();
  buttonLabel = input.required();
  @Input() dialogComponent!: ComponentType<unknown>;

  onNewInterner() {
    this.dialog.open(this.dialogComponent, {
      width: '35rem',
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false,
    });
  }
}
