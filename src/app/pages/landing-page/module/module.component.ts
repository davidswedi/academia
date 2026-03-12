import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap, firstValueFrom } from 'rxjs';
import { FirestoreService } from '../../../core/services/firebase/firestore.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-module',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    RouterLink,
  ],
  template: `
    <div class="container" *ngIf="module$ | async as m; else loading">
      <mat-card class="module-card">
        <div class="module-grid">
          <div class="left">
            <div class="image-wrap">
              <img
                class="hero-img"
                [src]="
                  m.imageUrl ||
                  'https://picsum.photos/800/450?random=' + (m.id || '1')
                "
                [alt]="m.title"
              />
            </div>

            <div class="quick-info">
              <div class="chips">
                <mat-chip-set role="list">
                  <mat-chip color="primary" selected
                    ><mat-icon>schedule</mat-icon>
                    {{ m.duration }} mois</mat-chip
                  >
                  <mat-chip color="accent" selected
                    ><mat-icon>paid</mat-icon> {{ m.tarrif }}€</mat-chip
                  >
                  <mat-chip
                    ><mat-icon>bar_chart</mat-icon> {{ m.level }}</mat-chip
                  >
                </mat-chip-set>
              </div>

              <div class="meta">
                <small
                  >Publié:
                  {{
                    m.createdAt?.seconds
                      ? (m.createdAt.seconds * 1000 | date : 'mediumDate')
                      : (m.createdAt | date : 'mediumDate')
                  }}</small
                >
              </div>
            </div>
          </div>

          <div class="right">
            <h2 class="title">{{ m.title }}</h2>
            <p class="description">{{ m.description }}</p>

            <div class="actions">
              <button
                mat-flat-button
                color="accent"
                [routerLink]="['/enrollement']"
              >
                S'inscrire
              </button>
              <button
                mat-icon-button
                (click)="toggleFavorite()"
                matTooltip="Ajouter aux favoris"
              >
                <mat-icon color="warn">{{
                  favorite ? 'favorite' : 'favorite_border'
                }}</mat-icon>
              </button>
              <button mat-icon-button (click)="share()" matTooltip="Partager">
                <mat-icon>share</mat-icon>
              </button>
            </div>

            <mat-divider></mat-divider>

            <section class="section">
              <h4>Objectifs clés</h4>
              <mat-chip-set role="list">
                <mat-chip *ngFor="let o of m.objectives">{{ o }}</mat-chip>
              </mat-chip-set>
            </section>

            <section class="section">
              <h4>Contenu du cours</h4>
              <div class="content-list">
                <mat-card class="section-card" *ngFor="let s of m.content">
                  <mat-card-header>
                    <mat-card-title>{{ s.title }}</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <p>{{ s.description }}</p>
                  </mat-card-content>
                </mat-card>
              </div>
            </section>

            <section class="section" *ngIf="m.requirements?.length">
              <h4>Prérequis</h4>
              <mat-list>
                <mat-list-item *ngFor="let r of m.requirements">{{
                  r
                }}</mat-list-item>
              </mat-list>
            </section>

            <div class="footer-actions">
              <button mat-button (click)="goBack()">
                <mat-icon>arrow_back</mat-icon> Retour
              </button>
            </div>
          </div>
        </div>
      </mat-card>
    </div>

    <ng-template #loading>
      <div class="loading">
        <mat-progress-spinner
          diameter="48"
          mode="indeterminate"
        ></mat-progress-spinner>
        <div class="loading-text">Chargement du module...</div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .container {
        padding: 20px;
      }
      .module-card {
        max-width: 1100px;
        margin: 24px auto;
        padding: 0;
        overflow: hidden;
      }
      .module-grid {
        display: grid;
        grid-template-columns: 360px 1fr;
        gap: 20px;
        align-items: start;
      }
      .left {
        background: #fafafa;
        padding: 12px;
        height: 100%;
      }
      .right {
        padding: 18px;
      }
      .hero-img {
        width: 100%;
        height: 220px;
        object-fit: cover;
        border-radius: 6px;
      }
      .title {
        margin: 6px 0 12px 0;
      }
      .description {
        color: rgba(0, 0, 0, 0.8);
        margin-bottom: 12px;
      }
      .actions {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: 12px;
      }
      .chips {
        margin: 8px 0;
      }
      .section {
        margin-top: 16px;
      }
      .section-card {
        margin-bottom: 10px;
      }
      .content-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .footer-actions {
        margin-top: 18px;
      }
      .loading {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: center;
        padding: 36px;
      }

      @media (max-width: 880px) {
        .module-grid {
          grid-template-columns: 1fr;
        }
        .hero-img {
          height: 200px;
        }
      }
    `,
  ],
})
export default class ModuleComponent {
  private route = inject(ActivatedRoute);
  private fs = inject(FirestoreService);
  private router = inject(Router);

  favorite = false;

  module$: Observable<any> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      if (!id) return of(null);
      return this.fs.getDocData(this.fs.trainingModuleCol, id);
    })
  );

  toggleFavorite() {
    this.favorite = !this.favorite;
    // TODO: persist favorite for user when auth available
  }

  async share() {
    const snapshot = await firstValueFrom(this.module$);
    const title = snapshot?.title || 'Formation';
    const url = window.location.href;

    if ((navigator as any)?.share) {
      try {
        await (navigator as any).share({ title, url });
      } catch (e) {
        // user cancelled
      }
    } else if ((navigator as any)?.clipboard) {
      try {
        await (navigator as any).clipboard.writeText(url);
        alert('Lien copié dans le presse-papier');
      } catch (e) {
        // ignore
      }
    } else {
      prompt('Copiez ce lien', url);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
