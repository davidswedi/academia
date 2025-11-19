import { Component } from '@angular/core';
import { HeaderTableActionsComponent } from '../../shared/header-table-actions.component';
import { SetmoduleComponent } from './setmodule/setmodule.component';
@Component({
  selector: 'app-learningmodules',
  imports: [HeaderTableActionsComponent],
  template: ` <app-header-table-actions
    headerTitle="Module"
    buttonLabel="Nouveau Module"
    [dialogComponent]="setIntership"
  ></app-header-table-actions>`,
  styles: ``,
})
export default class LearningmodulesComponent {
  setIntership = SetmoduleComponent;
}
