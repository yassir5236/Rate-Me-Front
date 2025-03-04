import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideAnimations } from '@angular/platform-browser/animations'; // Importez provideAnimations
import { provideToastr } from 'ngx-toastr'; // Importez provideToastr

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideCharts(withDefaultRegisterables()),
    provideAnimations(), // Fournit les animations nécessaires pour Toastr
    provideToastr({ // Configure Toastr
      timeOut: 3000, // Durée d'affichage de la notification (3 secondes)
      positionClass: 'toast-bottom-right', // Position de la notification
      preventDuplicates: true, // Empêche les notifications en double
      progressBar: true, // Affiche une barre de progression
      closeButton: true, // Affiche un bouton de fermeture
    }),
  ]
};



