import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  let activeRequests = 0;
  const _loadingService = inject(LoadingService);
  if (activeRequests === 0) {
    _loadingService.show();
  }
  activeRequests++;

  return next(req).pipe(finalize(() => {
    activeRequests--;
    if (activeRequests === 0) {
      _loadingService.hide();
    }
  }
  ));
};
