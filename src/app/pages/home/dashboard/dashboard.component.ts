import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../../core/services/firebase/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule,MatCardModule ],
  template: `
  <h2>Tableau de Bord</h2>
   <div class="summary-section">
        <mat-card class="card" appearance="outlined">
          <div class="card-icon"><mat-icon>people</mat-icon></div>
          <div class="card-body">
            <h4>Stagiaires</h4>
            <mat-card-subtitle class="total">{{ interners ?? '—' }}</mat-card-subtitle>
          </div>
        </mat-card>

        <mat-card class="card" appearance="outlined">
          <div class="card-icon"><mat-icon>person</mat-icon></div>
          <div class="card-body">
            <h4>Superviseurs</h4>
            <mat-card-subtitle class="total">{{ supervisors ?? '—' }}</mat-card-subtitle>
          </div>
        </mat-card>

      <mat-card class="card" appearance="outlined">
          <div class="card-icon"><mat-icon>menu_book</mat-icon></div>
          <div class="card-body">
            <h4>Modules</h4>
            <mat-card-subtitle class="total">{{ modules ?? '—' }}</mat-card-subtitle>
          </div>
        </mat-card>

       <mat-card class="card" appearance="outlined">
          <div class="card-icon"><mat-icon>work</mat-icon></div>
          <div class="card-body">
            <h4>Stages</h4>
            <mat-card-subtitle class="total">{{ interships ?? '—' }}</mat-card-subtitle>
          </div>
        </mat-card>

       <mat-card class="card" appearance="outlined">
          <div class="card-icon"><mat-icon>people_alt</mat-icon></div>
          <div class="card-body">
            <h4>Utilisateurs</h4>
            <mat-card-subtitle class="total">{{ users ?? '—' }}</mat-card-subtitle>
          </div>
        </mat-card>

       <mat-card class="card" appearance="outlined">
          <div class="card-icon"><mat-icon>how_to_reg</mat-icon></div>
          <div class="card-body">
            <h4>Inscriptions</h4>
            <mat-card-subtitle class="total">{{ enrollments ?? '—' }}</mat-card-subtitle>
          </div>
        </mat-card>
    </div>

        `,
  styles: `
  h2{
    margin:0.8rem;
  }
  .summary-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .card {
      display: flex;
      gap: 1rem;
      text-align: center;
      align-items: center;
      padding: 1rem;
      max-width: 335px;
      margin: 0.4rem;
    }

    .card .card-icon {
      width: 56px;
      height: 56px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.08);
    }

    .card .total {
      font-size: 1.4rem;
      font-weight: 600;
      margin-top: 0.25rem;
    }

    .card mat-icon { color: inherit; }
  `,
})
export default class DashboardComponent {
  fs = inject(FirestoreService);
  interners!: number | null;
  supervisors!: number | null;
  modules!: number | null;
  interships!: number | null;
  users!: number | null;
  enrollments!: number | null;

  async ngOnInit() {
    try {
      const [i, s, m, st, u, e] = await Promise.all([
        this.fs.countDocuments(this.fs.internerCol),
        this.fs.countDocuments(this.fs.supervisorCol),
        this.fs.countDocuments(this.fs.trainingModuleCol),
        this.fs.countDocuments(this.fs.intershipCol),
        this.fs.countDocuments(this.fs.userCol),
        this.fs.countDocuments(this.fs.enrollementCol),
      ]);
      this.interners = i;
      this.supervisors = s;
      this.modules = m;
      this.interships = st;
      this.users = u;
      this.enrollments = e;
    } catch (err) {
      console.error('Error loading dashboard counts', err);
      this.interners = this.supervisors = this.modules = this.interships = this.users = this.enrollments = 0;
    }
  }
}
