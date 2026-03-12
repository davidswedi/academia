import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FirestoreService } from '../../core/services/firebase/firestore.service';
import { Observable } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    AsyncPipe,
    CommonModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export default class LandingPageComponent {
  private fs = inject(FirestoreService);
  modules$: Observable<any[]> = this.fs.getTrainingModules();
  year = new Date().getFullYear();
  router = inject(Router);
  isScrolled = false;

  steps = [
    {
      title: 'Inscrivez-vous',
      description: 'Créez votre compte gratuitement et explorez nos programmes',
      icon: 'person_add',
    },
    {
      title: 'Apprenez & Pratiquez',
      description:
        'Suivez les cours en ligne avec des projets pratiques et des mentors',
      icon: 'school',
    },
    {
      title: 'Obtenez Certifié',
      description:
        "Passez l'examen final et recevez votre certification reconnue",
      icon: 'verified',
    },
    {
      title: 'Lancez Votre Carrière',
      description:
        "Accédez à nos offres d'emploi exclusives et trouvez votre rôle idéal",
      icon: 'trending_up',
    },
  ];

  testimonials = [
    {
      name: 'Sophie Durand',
      role: 'Développeuse Fullstack',
      quote:
        "TechAcademy m'a transformée en 3 mois. L'approche pratique et le mentorat m'ont permis de trouver un CDI avant même la fin du programme!",
      color: '#ec4899',
    },
    {
      name: 'Ahmed Hassan',
      role: 'Administrateur Réseau',
      quote:
        "Les formateurs sont vraiment experts et accessibles. J'ai pu construire un portfolio impressionnant qui m'a ouvert des portes.",
      color: '#008080',
    },
    {
      name: 'Marie Chen',
      role: 'Spécialiste Cloud AWS',
      quote:
        "Incroyable expérience! La certifications AWS que j'ai obtenue vaut son pesant d'or. L'équipe de placement m'a trouvé un job en 2 semaines.",
      color: '#8b5cf6',
    },
  ];

  faqs = [
    {
      question:
        'Comment fonctionnent les paiements et les conditions de remboursement?',
      answer:
        "Nous offrons une garantie de satisfaction à 100%. Si vous n'êtes pas satisfait dans les 30 premiers jours, nous vous rembourserons intégralement. Des plans de paiement flexibles sont également disponibles.",
    },
    {
      question: 'Quelle est la durée des cours?',
      answer:
        'Nos programmes varient de 4 à 12 semaines selon le niveau et la spécialité. Vous pouvez suivre à votre rythme avec accès à vie aux ressources.',
    },
    {
      question: 'Les certifications sont-elles reconnues?',
      answer:
        'Oui! Toutes nos certifications sont reconnues par les principaux employeurs et partenaires industriels (Google, Microsoft, AWS, etc.) et apparaissent sur LinkedIn.',
    },
    {
      question: "Quel est votre taux de placement d'emploi?",
      answer:
        'Notre taux de placement est de 92%. Plus de 90% de nos diplômés trouvent un emploi dans les 3 mois suivant leur certification.',
    },
    {
      question: 'Y a-t-il un support technique pendant les cours?',
      answer:
        "Absolument! Vous bénéficiez d'un support 24/7 par email et chat. Les mentors et la communauté sont toujours disponibles pour aider.",
    },
    {
      question: 'Puis-je prendre plusieurs cours à la fois?',
      answer:
        'Oui, beaucoup le font! Vous pouvez combiner les cours à votre rythme. Nous recommandons un maximum de 2-3 cours simultanément pour une qualité optimale.',
    },
    {
      question: "Quel est le prérequis pour s'inscrire?",
      answer:
        "Aucun prérequis technique n'est requis! Nous accueillons les débutants absolus. Des cours de base gratuits sont disponibles pour vous mettre à niveau.",
    },
    {
      question: 'Les cours incluent-ils des projets pratiques?',
      answer:
        'Oui! 70% du temps est consacré aux travaux pratiques. Vous construirez un portfolio professionnel avec 5+ projets réels utilisables sur votre CV.',
    },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  gotoEnrelloment() {
    this.router.navigate(['/enrollement']);
  }
}
