import { Component } from '@angular/core';
import { HeaderTableActionsComponent } from '../../shared/header-table-actions.component';
import { SetInternshipComponent } from './set-internship/set-internship.component';

@Component({
  selector: 'app-internship',
  imports: [HeaderTableActionsComponent],
  template: ` <app-header-table-actions
    headerTitle="Stage"
    buttonLabel="Nouvelle Affectation "
    [dialogComponent]="setIntership"
  ></app-header-table-actions>`,
  styles: ``,
})
export default class InternshipComponent {
  setIntership = SetInternshipComponent;
}
