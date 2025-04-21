import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwUpdateService {
  constructor(private swUpdate: SwUpdate) {
    if (this.swUpdate.isEnabled) {
      // Verificar actualizaciones cada 6 horas
      interval(6 * 60 * 60 * 1000).subscribe(() => this.swUpdate.checkForUpdate());

      // Escuchar actualizaciones disponibles
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          if (confirm('Hay una nueva versión disponible. ¿Deseas actualizar?')) {
            window.location.reload();
          }
        }
      });

      // Escuchar errores de actualización
      this.swUpdate.unrecoverable.subscribe(event => {
        console.error('Error en el Service Worker:', event.reason);
        alert('Ha ocurrido un error en la aplicación. Por favor, recarga la página.');
      });
    }
  }
} 