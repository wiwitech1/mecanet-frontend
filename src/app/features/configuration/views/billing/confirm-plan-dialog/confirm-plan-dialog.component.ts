import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

interface DialogData {
  planName: string;
  planCost: number;
}

@Component({
  selector: 'app-confirm-plan-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './confirm-plan-dialog.component.html',
  styleUrls: ['./confirm-plan-dialog.component.scss']
})
export class ConfirmPlanDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmPlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
