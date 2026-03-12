import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDivider } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService } from '../../../../core/services/firebase/firestore.service';
import { FieldValue, serverTimestamp } from '@angular/fire/firestore';
import {
  TrainingModule,
  CourseSection,
} from '../../../../core/models/module.model';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-setmodule',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDivider,
    MatDialogModule,
  ],
  template: `
    <h2 mat-dialog-title>Créer / Modifier un module</h2>
    <mat-divider />

    <mat-dialog-content>
      <form [formGroup]="moduleForm" (ngSubmit)="onSubmit()">
        <div style="display:flex; gap:8px; flex-wrap:wrap">
          <mat-form-field appearance="outline" style="flex:1 1 300px">
            <mat-label>Titre</mat-label>
            <input matInput formControlName="title" required />
          </mat-form-field>

          <mat-form-field appearance="outline" style="width:160px">
            <mat-label>Durée (Mois)</mat-label>
            <input matInput type="number" formControlName="duration" />
          </mat-form-field>

          <mat-form-field appearance="outline" style="width:200px">
            <mat-label>Niveau</mat-label>
            <mat-select formControlName="level">
              <mat-option value="Débutant">Débutant</mat-option>
              <mat-option value="Intermédiaire">Intermédiaire</mat-option>
              <mat-option value="Avancé">Avancé</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" style="width:160px">
            <mat-label>Tarif</mat-label>
            <input matInput type="number" formControlName="tarrif" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Description</mat-label>
          <textarea matInput rows="3" formControlName="description"></textarea>
        </mat-form-field>

        <div>
          <h3>Objectifs</h3>
          <div formArrayName="objectives">
            @for ( o of objectives.controls; track $index) {
            <div style="display:flex;gap:8px;align-items:center;">
              <mat-form-field appearance="outline" style="flex:1">
                <mat-label>Objectif {{ $index + 1 }}</mat-label>
                <input matInput [formControlName]="$index" />
              </mat-form-field>
              <button
                mat-icon-button
                color="warn"
                type="button"
                (click)="removeObjective($index)"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            }
          </div>
          <button
            mat-flat-button
            color="primary"
            type="button"
            (click)="addObjective()"
          >
            Ajouter objectif
          </button>
        </div>

        <div style="margin-top:1rem">
          <h3>Prérequis</h3>
          <div formArrayName="requirements">
            @for ( r of requirements.controls; track $index) {
            <div style="display:flex;gap:8px;align-items:center;">
              <mat-form-field appearance="outline" style="flex:1">
                <mat-label>Prérequis {{ $index + 1 }}</mat-label>
                <input matInput [formControlName]="$index" />
              </mat-form-field>
              <button
                mat-icon-button
                color="warn"
                type="button"
                (click)="removeRequirement($index)"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            }
          </div>
          <button
            mat-flat-button
            color="primary"
            type="button"
            (click)="addRequirement()"
          >
            Ajouter prérequis
          </button>
        </div>

        <div style="margin-top:1rem">
          <h3>Sections</h3>
          <div formArrayName="content">
            @for (s of content.controls; track $index) {
            <div
              [formGroupName]="$index"
              style="border:1px solid #e0e0e0;padding:8px;margin-bottom:8px;border-radius:4px"
            >
              <div style="display:flex;gap:8px;align-items:center">
                <mat-form-field appearance="outline" style="flex:1">
                  <mat-label>Titre section</mat-label>
                  <input matInput formControlName="title" />
                </mat-form-field>
                <button
                  mat-icon-button
                  color="warn"
                  type="button"
                  (click)="removeSection($index)"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
              <mat-form-field appearance="outline" style="width:100%">
                <mat-label>Description section</mat-label>
                <textarea
                  matInput
                  rows="2"
                  formControlName="description"
                ></textarea>
              </mat-form-field>
            </div>
            }
          </div>
          <button
            mat-flat-button
            color="primary"
            type="button"
            (click)="addSection()"
          >
            Ajouter une section
          </button>
        </div>
      </form>
    </mat-dialog-content>
    <mat-divider />
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>

      <button
        mat-flat-button
        [disabled]="moduleForm.invalid"
        (click)="onSubmit()"
      >
        Enregistrer
      </button>
    </mat-dialog-actions>
  `,

  styles: `
    mat-form-field { margin-bottom: 8px; }
    @media (max-width:600px){
      mat-form-field{ width:100% !important }
    }
  `,
})
export class SetmoduleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private fs = inject(FirestoreService);
  private snack = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<SetmoduleComponent>);
  private dialogData = inject(MAT_DIALOG_DATA, { optional: true });

  moduleForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    duration: [1, [Validators.required, Validators.min(0)]],
    level: ['Débutant', [Validators.required]],
    tarrif: [0, [Validators.required, Validators.min(0)]],
    requirements: this.fb.array([]),
    objectives: this.fb.array([this.fb.control('')]),
    content: this.fb.array([this.createSectionGroup()]),
  });

  private moduleCollection = this.fs.trainingModuleCol;
  isEditMode = false;
  editingModuleId: string | null = null;

  ngOnInit() {
    if (this.dialogData) {
      this.isEditMode = true;
      this.editingModuleId = this.dialogData;
      this.loadModuleForEdit(this.dialogData);
    }
  }

  private loadModuleForEdit(moduleId: string) {
    this.fs.getTrainingModules().subscribe((modules) => {
      const module = modules.find((m: any) => m.id === moduleId);
      if (module) {
        this.populateForm(module);
      }
    });
  }

  private populateForm(module: TrainingModule<any>) {
    this.moduleForm.patchValue({
      title: module.title,
      description: module.description,
      duration: module.duration,
      level: module.level,
      tarrif: module.tarrif,
    });

    // Clear and repopulate objectives
    while (this.objectives.length > 0) {
      this.objectives.removeAt(0);
    }
    (module.objectives || []).forEach((obj) => {
      this.objectives.push(this.fb.control(obj));
    });

    // Clear and repopulate requirements
    while (this.requirements.length > 0) {
      this.requirements.removeAt(0);
    }
    (module.requirements || []).forEach((req) => {
      this.requirements.push(this.fb.control(req));
    });

    // Clear and repopulate content sections
    while (this.content.length > 0) {
      this.content.removeAt(0);
    }
    (module.content || []).forEach((section) => {
      this.content.push(
        this.fb.group({
          title: [section.title || '', [Validators.required]],
          description: [section.description || ''],
        })
      );
    });
  }

  createSectionGroup() {
    return this.fb.nonNullable.group({
      title: ['', [Validators.required]],
      description: [''],
    });
  }

  get objectives(): FormArray {
    return this.moduleForm.get('objectives') as FormArray;
  }

  get content(): FormArray {
    return this.moduleForm.get('content') as FormArray;
  }

  addObjective() {
    this.objectives.push(this.fb.control(''));
  }

  removeObjective(i: number) {
    if (this.objectives.length > 1) this.objectives.removeAt(i);
  }

  addSection() {
    this.content.push(this.createSectionGroup());
  }

  removeSection(i: number) {
    if (this.content.length > 1) this.content.removeAt(i);
  }

  get requirements(): FormArray {
    return this.moduleForm.get('requirements') as FormArray;
  }

  addRequirement() {
    this.requirements.push(this.fb.control(''));
  }

  removeRequirement(i: number) {
    if (this.requirements.length > 0) this.requirements.removeAt(i);
  }

  onSubmit() {
    if (this.moduleForm.invalid) {
      this.moduleForm.markAllAsTouched();
      return;
    }

    const id = this.isEditMode
      ? this.editingModuleId!
      : this.fs.creasteDocId(this.moduleCollection);
    const raw = this.moduleForm.getRawValue();

    const module: TrainingModule<FieldValue> = {
      id,
      title: raw.title!,
      description: raw.description || '',
      duration: raw.duration!,
      level: raw.level,
      tarrif: raw.tarrif || 0,
      requirements: (raw.requirements || [])
        .map((r: any) => (typeof r === 'string' ? r : r[0]))
        .filter(Boolean),
      objectives: (raw.objectives || [])
        .map((o: any) => (typeof o === 'string' ? o : o[0]))
        .filter(Boolean),
      content: (raw.content || []) as CourseSection[],
      ...(this.isEditMode
        ? { updatedAt: serverTimestamp() }
        : { createdAt: serverTimestamp() }),
    };

    this.fs.setTrainingModule(module);
    const message = this.isEditMode ? 'Module modifié' : 'Module enregistré';
    this.snack.open(message, '', { duration: 2500 });
    this.dialogRef.close(true);
  }
}
