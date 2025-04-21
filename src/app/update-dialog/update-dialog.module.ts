import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UpdateDialogComponent } from './update-dialog.component';

@NgModule({
  declarations: [UpdateDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [UpdateDialogComponent]
})
export class UpdateDialogModule { } 