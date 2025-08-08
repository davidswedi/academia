import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "academia-8b85c", appId: "1:150327505879:web:7fc56c3bdf24299a189192", storageBucket: "academia-8b85c.firebasestorage.app", apiKey: "AIzaSyCa6e0D8b1VECSS--frZw0qKFXPCdPK5Dc", authDomain: "academia-8b85c.firebaseapp.com", messagingSenderId: "150327505879", measurementId: "G-89TCWY6F6Z" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
