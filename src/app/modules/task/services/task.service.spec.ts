import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { Task } from "../interfaces/task.interface";
import { TaskService } from "./task.service";

describe("TaskService", () => {
    let service: TaskService;
    let httpMock: import("@angular/common/http/testing").HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(TaskService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should get tasks", () => {
        const mockTasks: Task[] = [
            {
                id: "1",
                title: "Test",
                description: "desc",
                createdAt: new Date("2023-01-01"),
                completed: false
            }
        ];
        service.getTasks().subscribe(tasks => {
            expect(tasks).toEqual(mockTasks);
        });
        const req = httpMock.expectOne(`${service.url}/tasks`);
        expect(req.request.method).toBe("GET");
        req.flush(mockTasks);
    });

    it("should create a task", () => {
        const newTask = {
            title: "New",
            description: "desc",
            date: new Date("2023-01-01"),
            completed: false
        };
        const createdTask = {
            id: "2",
            title: "New",
            description: "desc",
            createdAt: new Date("2023-01-01"),
            completed: false
        };
        service.createTask(newTask as any).subscribe(task => {
            expect(task).toEqual(createdTask);
        });
        const req = httpMock.expectOne(`${service.url}/tasks`);
        expect(req.request.method).toBe("POST");
        expect(req.request.body).toEqual(newTask);
        req.flush(createdTask);
    });

    it("should update a task", () => {
        const updateData = {
            id: "1",
            title: "Updated",
            description: "desc",
            date: new Date("2023-01-01"),
            completed: true
        };
        const updatedTask = {
            id: "1",
            title: "Updated",
            description: "desc",
            createdAt: new Date("2023-01-01"),
            completed: true
        };
        service.updateTask(updateData).subscribe(task => {
            expect(task).toEqual(updatedTask);
        });
        const req = httpMock.expectOne(`${service.url}/tasks/${updateData.id}`);
        expect(req.request.method).toBe("PATCH");
        expect(req.request.body).toEqual(updateData);
        req.flush(updatedTask);
    });

    it("should delete a task", () => {
        const taskId = "1";
        service.deleteTask(taskId).subscribe(resp => {
            expect(resp).toBeTruthy();
        });
        const req = httpMock.expectOne(`${service.url}/tasks/${taskId}`);
        expect(req.request.method).toBe("DELETE");
        req.flush({});
    });

    afterEach(() => {
        httpMock.verify();
    });
});
