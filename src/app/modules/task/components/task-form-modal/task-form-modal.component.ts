import { Component, Inject, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatFormField, MatInputModule } from "@angular/material/input";

import { ToastService } from "../../../../shared/services/toast.service";
import { TaskFormData } from "../../interfaces/task.interface";
import { TaskService } from "../../services/task.service";

@Component({
    selector: "app-task-form-modal",
    standalone: true,
    imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatIconModule, MatInputModule, MatFormField],
    templateUrl: "./task-form-modal.component.html",
    styleUrl: "./task-form-modal.component.scss"
})
export class TaskFormModalComponent implements OnInit {
    fb = inject(FormBuilder);
    taskService = inject(TaskService);
    toastService = inject(ToastService);

    form!: FormGroup;
    userId = localStorage.getItem("userId");

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: TaskFormData,
        public dialogRef: MatDialogRef<TaskFormModalComponent>
    ) {
        this.buildForm();
    }

    ngOnInit() {
        if (this.data.isEditing) {
            this.form.patchValue({
                title: this.data.title,
                description: this.data.description,
                completed: this.data.completed
            });
        }
    }

    buildForm(): void {
        this.form = this.fb.group({
            title: ["", [Validators.required]],
            description: ["", [Validators.required]],
            completed: [false],
            userId: [this.userId]
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.data.isEditing) {
            this.updateTask(this.form.value);
        } else {
            this.createTask(this.form.value);
        }
    }

    createTask(formValue: TaskFormData): void {
        this.taskService.createTask(formValue).subscribe({
            next: () => {
                this.dialogRef.close(true);
                this.toastService.showSuccess("Tarea creada exitosamente");
                this.form.reset();
            },
            error: () => {
                this.toastService.showError("Error al crear la tarea");
            }
        });
    }

    updateTask(formValue: TaskFormData): void {
        const taskData: Partial<TaskFormData> = {
            ...formValue,
            id: this.data.id
        };

        this.taskService.updateTask(taskData).subscribe({
            next: () => {
                this.dialogRef.close(true);
                this.toastService.showSuccess("Tarea actualizada exitosamente");
            },
            error: () => {
                this.toastService.showError("Error al actualizar la tarea");
            }
        });
    }
}
