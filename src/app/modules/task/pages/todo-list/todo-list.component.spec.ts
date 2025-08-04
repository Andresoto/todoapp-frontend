import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { createComponentFactory, Spectator, SpyObject } from "@ngneat/spectator/jest";
import { of, throwError } from "rxjs";

import { ToastService } from "../../../../shared/services/toast-service/toast.service";
import { Task } from "../../interfaces/task.interface";
import { TaskService } from "../../services/task.service";
import { TodoListComponent } from "./todo-list.component";

describe("TodoListComponent", () => {
    let spectator: Spectator<TodoListComponent>;
    let taskService: SpyObject<TaskService>;
    let toastService: SpyObject<ToastService>;
    let dialog: SpyObject<MatDialog>;
    let router: SpyObject<Router>;

    const mockTasks: Task[] = [
        {
            id: "1",
            title: "Task 1",
            description: "Description 1",
            completed: false,
            createdAt: new Date("2024-01-01")
        },
        {
            id: "2",
            title: "Task 2",
            description: "Description 2",
            completed: true,
            createdAt: new Date("2024-01-02")
        }
    ];

    const createComponent = createComponentFactory({
        component: TodoListComponent,
        imports: [NoopAnimationsModule],
        mocks: [HttpClient, TaskService, ToastService, MatDialog, Router]
    });

    beforeEach(() => {
        spectator = createComponent({
            detectChanges: false
        });

        taskService = spectator.inject(TaskService);
        toastService = spectator.inject(ToastService);
        dialog = spectator.inject(MatDialog);
        router = spectator.inject(Router);

        taskService.getTasks.mockReturnValue(of(mockTasks));
        taskService.updateTask.mockReturnValue(of(mockTasks[0]));
        taskService.deleteTask.mockReturnValue(of({}));
    });

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });

    it("should initialize with default values", () => {
        expect(spectator.component.tasks()).toEqual([]);
        expect(spectator.component.userEmail()).toBe("");
        expect(spectator.component.isFormOpen()).toBe(false);
        expect(spectator.component.editingTask()).toBeNull();
        expect(spectator.component.isLoading()).toBe(false);
        expect(spectator.component.filterSelected()).toBe("all");
    });

    it("should have correct filter options", () => {
        const expectedFilters = [
            { label: "Todas", value: "all" },
            { label: "Pendientes", value: "pending" },
            { label: "Completadas", value: "completed" }
        ];
        expect(spectator.component.filters()).toEqual(expectedFilters);
    });

    it("should calculate completed tasks correctly", () => {
        spectator.component.tasks.set(mockTasks);
        expect(spectator.component.completedTasks()).toBe(1);
    });

    it("should calculate total tasks correctly", () => {
        spectator.component.tasks.set(mockTasks);
        expect(spectator.component.totalTasks()).toBe(2);
    });

    it("should calculate completed tasks correctly when no tasks", () => {
        spectator.component.tasks.set([]);
        expect(spectator.component.completedTasks()).toBe(0);
        expect(spectator.component.totalTasks()).toBe(0);
    });

    it("should load tasks on init", () => {
        spectator.detectChanges(); // This triggers ngOnInit
        expect(taskService.getTasks).toHaveBeenCalled();
    });

    describe("task loading", () => {
        it("should update tasks after successful load", () => {
            spectator.component.getTasks();
            expect(spectator.component.tasks()).toEqual(mockTasks);
            expect(spectator.component.isLoading()).toBe(false);
        });

        it("should handle error when loading tasks fails", () => {
            const errorResponse = new Error("Failed to load tasks");
            taskService.getTasks.mockReturnValue(throwError(() => errorResponse));

            spectator.component.getTasks();

            expect(toastService.showError).toHaveBeenCalledWith("Error al intentar cargar las tareas");
            expect(spectator.component.isLoading()).toBe(false);
        });
    });

    describe("task filtering", () => {
        beforeEach(() => {
            spectator.component.tasks.set(mockTasks);
        });

        it("should change filter when onFilterChange is called", () => {
            spectator.component.onFilterChange("pending");
            expect(spectator.component.filterSelected()).toBe("pending");
        });

        it("should not change filter if same value is provided", () => {
            spectator.component.filterSelected.set("completed");
            spectator.component.onFilterChange("completed");
            expect(spectator.component.filterSelected()).toBe("completed");
        });

        it("should change filter to all", () => {
            spectator.component.onFilterChange("all");
            expect(spectator.component.filterSelected()).toBe("all");
        });
    });

    describe("task operations", () => {
        it("should open create task dialog", () => {
            const dialogRefMock = {
                afterClosed: () => of(true)
            };
            dialog.open.mockReturnValue(dialogRefMock as any);

            spectator.component.createTask();

            expect(dialog.open).toHaveBeenCalled();
        });

        it("should reload tasks after successful creation", () => {
            const dialogRefMock = {
                afterClosed: () => of(true)
            };
            dialog.open.mockReturnValue(dialogRefMock as any);
            const getTasksSpy = jest.spyOn(spectator.component, "getTasks");

            spectator.component.createTask();

            expect(getTasksSpy).toHaveBeenCalled();
        });

        it("should open edit task dialog", () => {
            const dialogRefMock = {
                afterClosed: () => of(true)
            };
            dialog.open.mockReturnValue(dialogRefMock as any);

            spectator.component.openEditForm(mockTasks[0]);

            expect(dialog.open).toHaveBeenCalled();
            const callArgs = dialog.open.mock.calls[0];
            expect(callArgs[1]).toEqual({
                data: {
                    isEditing: true,
                    id: mockTasks[0].id,
                    title: mockTasks[0].title,
                    description: mockTasks[0].description,
                    completed: mockTasks[0].completed
                },
                width: "450px"
            });
        });

        it("should reload tasks after successful edit", () => {
            const dialogRefMock = {
                afterClosed: () => of(true)
            };
            dialog.open.mockReturnValue(dialogRefMock as any);
            const getTasksSpy = jest.spyOn(spectator.component, "getTasks");

            spectator.component.openEditForm(mockTasks[0]);

            expect(getTasksSpy).toHaveBeenCalled();
        });

        it("should handle task completion toggle", () => {
            const updatedTask = { ...mockTasks[0], completed: true };
            taskService.updateTask.mockReturnValue(of(updatedTask));
            spectator.component.tasks.set([...mockTasks]);

            spectator.component.handleToggleComplete(updatedTask);

            expect(taskService.updateTask).toHaveBeenCalledWith(updatedTask);
            expect(spectator.component.tasks().find(t => t.id === updatedTask.id)?.completed).toBe(true);
        });

        it("should handle toggle completion error", () => {
            const taskToToggle = { ...mockTasks[0], completed: true };
            const errorResponse = new Error("Update failed");
            taskService.updateTask.mockReturnValue(throwError(() => errorResponse));
            spectator.component.tasks.set([...mockTasks]);

            spectator.component.handleToggleComplete(taskToToggle);

            expect(toastService.showError).toHaveBeenCalledWith("Error al intentar actualizar la tarea");
            expect(spectator.component.tasks().find(t => t.id === taskToToggle.id)?.completed).toBe(false);
        });

        it("should handle task deletion", () => {
            spectator.component.tasks.set([...mockTasks]);
            taskService.deleteTask.mockReturnValue(of({}));

            spectator.component.handleDeleteTask(mockTasks[0].id);

            expect(taskService.deleteTask).toHaveBeenCalledWith(mockTasks[0].id);
            expect(spectator.component.tasks()).not.toContain(mockTasks[0]);
            expect(toastService.showSuccess).toHaveBeenCalledWith("Tarea eliminada correctamente");
        });

        it("should handle delete task error", () => {
            const errorResponse = new Error("Delete failed");
            taskService.deleteTask.mockReturnValue(throwError(() => errorResponse));

            spectator.component.handleDeleteTask(mockTasks[0].id);

            expect(toastService.showError).toHaveBeenCalledWith("Error al intentar eliminar la tarea");
        });
    });

    describe("navigation", () => {
        it("should navigate to login when logout is called", () => {
            spectator.component.handleLogout();

            expect(router.navigate).toHaveBeenCalledWith(["/login"]);
        });

        it("should remove userId from localStorage on logout", () => {
            const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

            spectator.component.handleLogout();

            expect(removeItemSpy).toHaveBeenCalledWith("userId");
        });
    });

    describe("initialization", () => {
        it("should load tasks on init", () => {
            spectator.detectChanges();

            expect(taskService.getTasks).toHaveBeenCalled();
            expect(spectator.component.tasks()).toEqual(mockTasks);
            expect(spectator.component.isLoading()).toBe(false);
        });
    });
});
