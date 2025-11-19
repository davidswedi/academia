import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-setmodule',
  imports: [ReactiveFormsModule],
  template: ` <p>setmodule works!</p> `,
  styles: ``,
})
export class SetmoduleComponent {
  private fb = inject(FormBuilder);

  ModuleForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
  });
}
