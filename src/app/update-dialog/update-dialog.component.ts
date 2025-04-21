import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-dialog',
  template: `
    <h2 mat-dialog-title>Actualización Disponible</h2>
    <mat-dialog-content>
      <p>Hay una nueva versión de la aplicación disponible. ¿Desea actualizar ahora?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Más tarde</button>
      <button mat-raised-button color="primary" (click)="onYesClick()">Actualizar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-actions {
      padding: 16px 0 0 0;
    }
  `]
})
export class UpdateDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
} 