import { HttpStatusCode } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { ToastService } from "../../../../shared/services/toast-service/toast.service";
import { RegisterModalComponent } from "../../components/register-modal/register-modal.component";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule
    ],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
    authService = inject(AuthService);
    router = inject(Router);
    fb = inject(FormBuilder);
    dialog = inject(MatDialog);
    toastService = inject(ToastService);

    form!: FormGroup;
    isLoading = signal(false);
    formValid = signal(false);

    constructor() {
        this.buildForm();
    }

    buildForm() {
        this.form = this.fb.group({
            email: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$")]]
        });
    }

    handleSubmit() {
        this.isLoading.set(true);
        const formValue = this.form.getRawValue();
        this.authService.login(formValue.email).subscribe({
            next: response => {
                this.isLoading.set(false);
                if (response.status === HttpStatusCode.NoContent) {
                    this.registerEmail(formValue.email);
                } else {
                    localStorage.setItem("userId", response.body!.id);
                    localStorage.setItem("userEmail", response.body!.email);
                    this.toastService.showSuccess("¡Bienvenido! Has iniciado sesión correctamente");
                    this.router.navigate(["/tasks"]);
                }
            },
            error: () => {
                this.isLoading.set(false);
                this.toastService.showError("Error al iniciar sesión. Por favor intenta nuevamente");
            }
        });
    }

    registerEmail(email: string) {
        const dialogRef = this.dialog.open(RegisterModalComponent, {
            width: "450px",
            data: email
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.authService.register(email).subscribe({
                    next: resp => {
                        localStorage.setItem("userId", resp.id);
                        localStorage.setItem("userEmail", resp.email);
                        this.toastService.showSuccess("¡Registro exitoso! Bienvenido");
                        this.router.navigate(["/tasks"]);
                    },
                    error: () => {
                        this.toastService.showError("Error al registrar usuario. Por favor intenta nuevamente");
                    }
                });
            }
        });
    }
}
