import { DecimalPipe, NgClass } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
import { FilterPipe } from "../../../../shared/pipes/filter.pipe";
import { ToastService } from "../../../../shared/services/toast-service/toast.service";
import { TaskFormModalComponent } from "../../components/task-form-modal/task-form-modal.component";
import { TaskItemComponent } from "../../components/task-item/task-item.component";
import { Task } from "../../interfaces/task.interface";
import { TaskService } from "../../services/task.service";

@Component({
    selector: "app-todo-list",
    standalone: true,
    imports: [
        TaskItemComponent,
        DecimalPipe,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        FilterPipe,
        LoaderComponent,
        NgClass
    ],
    templateUrl: "./todo-list.component.html",
    styleUrl: "./todo-list.component.scss"
})
export class TodoListComponent implements OnInit {
    taskService = inject(TaskService);
    toastService = inject(ToastService);
    dialog = inject(MatDialog);

    tasks = signal<Task[]>([]);
    userEmail = signal<string>("");
    isFormOpen = signal<boolean>(false);
    editingTask = signal<Task | null>(null);
    isLoading = signal<boolean>(false);
    filters = signal<{ label: string; value: string }[]>([
        { label: "Todas", value: "all" },
        { label: "Pendientes", value: "pending" },
        { label: "Completadas", value: "completed" }
    ]);
    filterSelected = signal<string>("all");

    completedTasks = computed(() => this.tasks().filter(task => task.completed).length);
    totalTasks = computed(() => this.tasks().length);

    ngOnInit(): void {
        this.getTasks();
    }

    constructor(private router: Router) {
        this.userEmail.set(localStorage.getItem("userEmail") || "");
    }

    getTasks() {
        this.isLoading.set(true);
        this.taskService.getTasks().subscribe({
            next: tasks => {
                this.tasks.set(tasks);
                this.isLoading.set(false);
            },
            error: () => {
                this.toastService.showError("Error al intentar cargar las tareas");
                this.isLoading.set(false);
            }
        });
    }

    onFilterChange(filterValue: string) {
        if (this.filterSelected() !== filterValue) {
            this.filterSelected.set(filterValue);
        }
    }

    handleToggleComplete(task: Task) {
        this.taskService.updateTask(task).subscribe({
            next: resp => {
                this.tasks.update(currentTasks =>
                    currentTasks.map(item => (item.id === resp.id ? { ...item, completed: resp.completed } : item))
                );
            },
            error: () => {
                this.toastService.showError("Error al intentar actualizar la tarea");
                this.tasks.update(currentTasks =>
                    currentTasks.map(item => (item.id === task.id ? { ...item, completed: !task.completed } : item))
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
        const dialogRef = this.dialog.open(TaskFormModalComponent, {
            data: {
                isEditing: true,
                id: task.id,
                title: task.title,
                description: task.description,
                completed: task.completed
            },
            width: "450px"
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getTasks();
            }
        });
    }

    createTask() {
        const dialogRef = this.dialog.open(TaskFormModalComponent, {
            data: {
                title: "",
                description: "",
                completed: false
            },
            width: "450px"
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getTasks();
            }
        });
    }
}
