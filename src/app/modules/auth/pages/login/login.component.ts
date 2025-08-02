import { HttpStatusCode } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
    authService = inject(AuthService);
    router = inject(Router);
    fb = inject(FormBuilder);
    form!: FormGroup;
    isLoading = false;
    errorMessage = "";

    constructor() {
        this.buildForm();
    }

    buildForm() {
        this.form = this.fb.group({
            email: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$")]]
        });
    }

    handleSubmit() {
        this.isLoading = true;
        const formValue = this.form.getRawValue();
        this.authService.login(formValue.email).subscribe({
            next: response => {
                this.isLoading = false;
                if (response.status === HttpStatusCode.NoContent) {
                    // TODO: Abrir modal para crear usuario
                } else {
                    localStorage.setItem("userId", response.body!.id);
                    this.router.navigate(["/tasks"]);
                }
            },
            error: () => {
                // TODO: controlar errores
            }
        });
    }

    updateErrorMessage() {
        if (this.form.get("email")?.hasError("required")) {
            this.errorMessage = "Este campo es obligatorio";
        } else if (this.form.get("email")?.hasError("pattern")) {
            this.errorMessage = "Ingrese un correo valido";
        } else {
            this.errorMessage = "";
        }
    }
}
