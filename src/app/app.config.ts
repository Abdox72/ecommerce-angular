import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
      provideRouter(routes),
      provideHttpClient(),
      provideAnimations(),
      provideToastr(),
      provideHttpClient(
        withInterceptors([loadingInterceptor])
      ),
  ]
};
