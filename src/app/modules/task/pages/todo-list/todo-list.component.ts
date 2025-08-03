import { DecimalPipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

import { ToastService } from "../../../../shared/services/toast.service";
import { TaskItemComponent } from "../../components/task-item/task-item.component";
import { Task, TaskService } from "../../services/task.service";

@Component({
    selector: "app-todo-list",
    standalone: true,
    imports: [TaskItemComponent, DecimalPipe, MatButtonModule, MatIconModule],
    templateUrl: "./todo-list.component.html",
    styleUrl: "./todo-list.component.scss"
})
export class TodoListComponent implements OnInit {
    taskService = inject(TaskService);
    toastService = inject(ToastService);

    tasks = signal<Task[]>([]);
    userEmail = signal<string>("");
    isFormOpen = signal<boolean>(false);
    editingTask = signal<Task | null>(null);

    completedTasks = computed(() => this.tasks().filter(task => task.completed).length);
    totalTasks = computed(() => this.tasks().length);

    ngOnInit(): void {
        this.getTasks();
    }

    constructor(private router: Router) {}

    getTasks() {
        this.taskService.getTasks().subscribe({
            next: tasks => {
                const formattedTasks = tasks.map(task => ({
                    ...task,
                    date: TodoListComponent.formatTimestamp(task.createdAt)
                }));
                this.tasks.set(formattedTasks);
            },
            error: () => {
                this.toastService.showError("Error al intentar cargar las tareas");
            }
        });
    }

    handleToggleComplete(task: Task) {
        this.taskService.updateTask(task).subscribe({
            next: resp => {
                this.tasks.update(currentTasks => currentTasks.map(item => (item.id === resp.id ? resp : item)));
            },
            error: () => {
                this.toastService.showError("Error al intentar actualizar la tarea");
                this.tasks.update(currentTasks =>
                    currentTasks.map(item => (item.id === task.id ? { ...item, completed: !item.completed } : item))
                );
            }
        });
    }

    handleDeleteTask(taskId: string) {
        this.taskService.deleteTask(taskId).subscribe({
            next: () => {
                this.tasks.update(currentTasks => currentTasks.filter(task => task.id !== taskId));
                this.toastService.showSuccess("Tarea eliminada correctamente");
            },
            error: () => {
                this.toastService.showError("Error al intentar eliminar la tarea");
            }
        });
    }

    handleLogout() {
        localStorage.removeItem("userId");
        this.router.navigate(["/login"]);
    }

    openEditForm(task: Task) {
        // TODO: Implementar la lógica para abrir el formulario de edición
    }

    setIsFormOpen() {
        // TODO: Implementar la lógica para abrir el formulario de creación de tareas
    }

    private static formatTimestamp(timestamp: { _seconds: number; _nanoseconds: number }): Date {
        // eslint-disable-next-line no-underscore-dangle
        return new Date(timestamp._seconds * 1000);
    }
}
