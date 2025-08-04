import { inject, Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
    providedIn: "root"
})
export class ToastService {
    private snackBar = inject(MatSnackBar);

    private defaultConfig: MatSnackBarConfig = {
        duration: 4000,
        horizontalPosition: "right",
        verticalPosition: "top"
    };

    showSuccess(message: string) {
        this.snackBar.open(message, undefined, {
            ...this.defaultConfig,
            panelClass: ["success-toast"]
        });
    }

    showError(message: string) {
        this.snackBar.open(message, undefined, {
            ...this.defaultConfig,
            panelClass: ["error-toast"]
        });
    }

    showInfo(message: string) {
        this.snackBar.open(message, undefined, {
            ...this.defaultConfig,
            panelClass: ["info-toast"]
        });
    }

    showWarning(message: string) {
        this.snackBar.open(message, undefined, {
            ...this.defaultConfig,
            panelClass: ["warning-toast"]
        });
    }
}
