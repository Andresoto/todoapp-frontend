import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-register-modal",
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: "./register-modal.component.html",
    styleUrl: "./register-modal.component.scss"
})
export class RegisterModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: string,
        public dialogRef: MatDialogRef<RegisterModalComponent>
    ) {}
}
