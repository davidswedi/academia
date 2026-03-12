import { Component, inject, OnInit } from '@angular/core';
import { FieldValue, serverTimestamp } from '@angular/fire/firestore';
import { Enrollment } from '../../core/models/enrollment.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TrainingModule } from '../../core/models/module.model';
import { FirestoreService } from '../../core/services/firebase/firestore.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-enrollements',
  imports: [
    MatCheckboxModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatCardModule,
    MatStepperModule,
    MatButtonModule,
    CommonModule,
    MatSelectModule,
    MatProgressBarModule,
    AsyncPipe,
  ],
  templateUrl: './enrollements.component.html',
  styleUrl: './enrollements.component.scss',
})
export default class EnrollementsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private fs = inject(FirestoreService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // Form Groups
  personalFormGroup!: FormGroup;
  educationFormGroup!: FormGroup;
  professionalFormGroup!: FormGroup;
  courseFormGroup!: FormGroup;
  agreementFormGroup!: FormGroup;

  // Modules observable
  modules$!: Observable<TrainingModule<FieldValue>[]>;

  // State
  currentStep = 0;
  totalSteps = 5;
  isSubmitting = false;

  ngOnInit() {
    this.initializeForms();
    // load training modules for selection
    this.modules$ = this.fs.getTrainingModules() as Observable<
      TrainingModule<FieldValue>[]
    >;
  }

  private initializeForms() {
    this.personalFormGroup = this.fb.nonNullable.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: [''],
      nationality: [''],
    });

    this.educationFormGroup = this.fb.nonNullable.group({
      educationLevel: ['', [Validators.required]],
      field: [''],
      institution: [''],
    });

    this.professionalFormGroup = this.fb.nonNullable.group({
      currentJobTitle: [''],
      experience: [0],
      industry: [''],
      techExperience: [''],
    });

    this.courseFormGroup = this.fb.nonNullable.group({
      preferredSchedule: ['', [Validators.required]],
      selectedModule: ['', [Validators.required]],
      startDate: [''],
      motivation: ['', [Validators.required]],
      careerGoals: [''],
      howYouHeardAboutUs: [''],
      notes: [''],
    });

    this.agreementFormGroup = this.fb.nonNullable.group({
      agreeToTerms: [false, [Validators.requiredTrue]],
      agreeToMarketing: [false],
    });
  }

  onStepChange(event: any) {
    this.currentStep = event.selectedIndex;
  }

  onSubmit() {
    // Validate all forms
    if (
      !this.personalFormGroup.valid ||
      !this.educationFormGroup.valid ||
      !this.professionalFormGroup.valid ||
      !this.courseFormGroup.valid ||
      !this.agreementFormGroup.valid
    ) {
      this.snackBar.open(
        'Veuillez remplir tous les champs obligatoires',
        'Fermer',
        { duration: 4000 }
      );
      return;
    }

    this.isSubmitting = true;

    // Create enrollment object
    const enrollmentId = this.fs.creasteDocId('enrollments');

    const enrollment: Enrollment<FieldValue> = {
      id: enrollmentId,
      // Personal
      firstName: this.personalFormGroup.get('firstName')!.value,
      lastName: this.personalFormGroup.get('lastName')!.value,
      email: this.personalFormGroup.get('email')!.value,
      phone: this.personalFormGroup.get('phone')!.value,
      gender: this.personalFormGroup.get('gender')!.value,
      dateOfBirth: this.personalFormGroup.get('dateOfBirth')!.value,
      nationality: this.personalFormGroup.get('nationality')!.value,

      // Education
      educationLevel: this.educationFormGroup.get('educationLevel')!.value,
      institution: this.educationFormGroup.get('institution')!.value,
      field: this.educationFormGroup.get('field')!.value,

      // Professional
      currentJobTitle: this.professionalFormGroup.get('currentJobTitle')!.value,
      experience: this.professionalFormGroup.get('experience')!.value || 0,
      industry: this.professionalFormGroup.get('industry')!.value,
      techExperience: this.professionalFormGroup.get('techExperience')!.value,

      // Course
      selectedCourses: [],
      selectedModule: this.courseFormGroup.get('selectedModule')!.value,
      preferredSchedule: this.courseFormGroup.get('preferredSchedule')!.value,
      startDate: this.courseFormGroup.get('startDate')!.value,
      motivation: this.courseFormGroup.get('motivation')!.value,
      careerGoals: this.courseFormGroup.get('careerGoals')!.value,
      howYouHeardAboutUs: this.courseFormGroup.get('howYouHeardAboutUs')!.value,

      // Agreement
      agreeToTerms: this.agreementFormGroup.get('agreeToTerms')!.value,
      agreeToMarketing: this.agreementFormGroup.get('agreeToMarketing')!.value,

      // System
      status: 'pending',
      submittedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    // Save to Firestore
    this.fs.setEnrollement('enrollments', enrollmentId, enrollment).then(
      () => {
        this.isSubmitting = false;

        // Success message
        this.snackBar.open(
          '✓ Inscription soumise avec succès! Un email de confirmation a été envoyé.',
          'Fermer',
          {
            duration: 6000,
            panelClass: 'success-snackbar',
          }
        );

        // Reset forms
        this.personalFormGroup.reset();
        this.educationFormGroup.reset();
        this.professionalFormGroup.reset();
        this.courseFormGroup.reset();
        this.agreementFormGroup.reset();

        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      (error: unknown) => {
        this.isSubmitting = false;
        this.snackBar.open(
          'Erreur lors de la soumission. Veuillez réessayer.',
          'Fermer',
          { duration: 4000, panelClass: 'error-snackbar' }
        );
        console.error('Enrollment error:', error);
      }
    );
  }
}
