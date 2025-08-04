import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Task } from "../../interfaces/task.interface";
import { TaskItemComponent } from "./task-item.component";

describe("TaskItemComponent", () => {
    let component: TaskItemComponent;
    let fixture: ComponentFixture<TaskItemComponent>;

    const mockTask: Task = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        completed: false,
        createdAt: new Date("2024-01-01")
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaskItemComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskItemComponent);
        component = fixture.componentInstance;

        component.task = mockTask;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
