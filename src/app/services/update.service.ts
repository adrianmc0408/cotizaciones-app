import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  constructor(
    private dialog: MatDialog,
    private swUpdate: SwUpdate
  ) {
    if (this.swUpdate.isEnabled) {
      // Verificar actualizaciones cada minuto
      interval(60 * 1000).subscribe(() => this.checkForUpdates());
    }
  }

  public checkForUpdates(): void {
    this.swUpdate.checkForUpdate().then(() => {
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          this.showUpdateDialog();
        }
      });
    });
  }

  private showUpdateDialog(): void {
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.swUpdate.activateUpdate().then(() => {
          window.location.reload();
        });
      }
    });
  }
} 