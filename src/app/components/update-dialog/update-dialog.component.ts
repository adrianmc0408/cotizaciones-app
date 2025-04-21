import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="update-dialog">
      <div class="dialog-header">
        <span class="icon">🔄</span>
        <h2>Nueva versión disponible</h2>
      </div>
      
      <div class="dialog-content">
        <p>Hay una nueva versión de la aplicación lista para instalar. ¿Deseas actualizar ahora?</p>
      </div>

      <div class="dialog-actions">
        <button class="button secondary" (click)="onNoClick()">Más tarde</button>
        <button class="button primary" (click)="onYesClick()">Actualizar ahora</button>
      </div>
    </div>
  `,
  styles: [`
    .update-dialog {
      background: white;
      border-radius: 16px;
      padding: 24px;
      max-width: 400px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .dialog-header .icon {
      font-size: 24px;
    }

    .dialog-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .dialog-content {
      margin-bottom: 24px;
    }

    .dialog-content p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .button {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .button.primary {
      background-color: #4CAF50;
      color: white;
    }

    .button.secondary {
      background-color: #f5f5f5;
      color: #666;
    }

    .button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
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