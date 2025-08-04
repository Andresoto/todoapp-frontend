import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";

export interface ConfirmationDialogData {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
}

@Component({
    selector: "app-confirmation-dialog",
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: "./confirmation-dialog.component.html",
    styleUrls: ["./confirmation-dialog.component.scss"]
})
export class ConfirmationDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
    ) {}

    /**
     * Closes the dialog with a confirmation response
     */
    public onConfirm(): void {
        this.dialogRef.close(true);
    }

    /**
     * Closes the dialog without confirmation
     */
    public onCancel(): void {
        this.dialogRef.close(false);
    }
}
