import { DatePipe, NgClass } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";

import { ConfirmationService } from "../../../../shared/services/confirmation-service/confirmation.service";
import { Task } from "../../interfaces/task.interface";

@Component({
    selector: "app-task-item",
    standalone: true,
    imports: [FormsModule, DatePipe, MatCheckboxModule, MatIconModule, NgClass],
    templateUrl: "./task-item.component.html",
    styleUrl: "./task-item.component.scss"
})
export class TaskItemComponent {
    @Input() task!: Task;
    @Output() toggleComplete = new EventEmitter<Task>();
    @Output() edit = new EventEmitter<Task>();
    @Output() delete = new EventEmitter<string>();

    private confirmationService = inject(ConfirmationService);

    /**
     * Returns CSS class for date badge based on task completion status
     * @returns CSS class name for styling the date badge
     */
    getDateBadgeClass(): string {
        if (!this.task.completed) return "badge-primary";
        return "badge-destructive";
    }

    /**
     * Handles task deletion with user confirmation
     */
    deleteTask(): void {
        this.confirmationService
            .confirmDelete(
                "Eliminar tarea",
                `¿Estás seguro de que deseas eliminar la tarea "${this.task.title}"? Esta acción no se puede deshacer.`
            )
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.delete.emit(this.task.id);
                }
            });
    }

    /**
     * Handles checkbox click with confirmation dialog for task completion toggle
     */
    onCheckboxClick(): void {
        const action = this.task.completed ? "marcar como pendiente" : "marcar como completada";
        const title = this.task.completed ? "Marcar como pendiente" : "Completar tarea";
        const description = `¿Estás seguro de que deseas ${action} la tarea "${this.task.title}"?`;

        this.confirmationService
            .openConfirmationDialog(title, description, "Confirmar", "Cancelar")
            .subscribe((confirmed: boolean) => {
                if (confirmed === true) {
                    this.toggleComplete.emit(this.task);
                } else {
                    this.task.completed = !this.task.completed;
                }
            });
    }
}
