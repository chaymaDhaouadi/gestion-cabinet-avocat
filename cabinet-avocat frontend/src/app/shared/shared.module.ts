// shared.module.ts
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';

export const sharedImports = [
    CommonModule,
];

export const sharedProviders = [
    provideAnimations(),    // Pour activer BrowserAnimationsModule
    provideToastr({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
    }),
];
