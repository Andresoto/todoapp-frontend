import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { TaskFormData } from "../../interfaces/task.interface";
import { TaskFormModalComponent } from "./task-form-modal.component";

describe("TaskFormModalComponent", () => {
    let component: TaskFormModalComponent;
    let fixture: ComponentFixture<TaskFormModalComponent>;

    const mockDialogData: TaskFormData = {
        title: "",
        description: "",
        completed: false,
        userId: "test-user",
        isEditing: false
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaskFormModalComponent, HttpClientTestingModule, NoopAnimationsModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                { provide: MatDialogRef, useValue: { close: jest.fn() } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskFormModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
