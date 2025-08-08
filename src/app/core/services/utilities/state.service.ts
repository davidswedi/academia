import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  isToggleDrawer = signal(false);

  toggleDrawer = () => this.isToggleDrawer.update((value) => !value);

  constructor() {}
}
