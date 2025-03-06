import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideAnimations } from '@angular/platform-browser/animations'; 
import { provideToastr } from 'ngx-toastr'; 
import { provideStore } from '@ngrx/store';
import { likesReducer } from './store/reducers/likes.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideCharts(withDefaultRegisterables()),
    provideAnimations(), 
    provideToastr({ 
      timeOut: 3000, 
      positionClass: 'toast-bottom-right',
      preventDuplicates: true, 
      progressBar: true,
      closeButton: true, 
    }),
    provideStore({ likes: likesReducer }),
  ]
};



