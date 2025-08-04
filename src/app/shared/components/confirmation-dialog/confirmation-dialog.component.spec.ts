import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { ConfirmationDialogComponent, ConfirmationDialogData } from "./confirmation-dialog.component";

describe("ConfirmationDialogComponent", () => {
    let component: ConfirmationDialogComponent;
    let fixture: ComponentFixture<ConfirmationDialogComponent>;
    let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

    const mockData: ConfirmationDialogData = {
        title: "Test Title",
        description: "Test Description",
        confirmText: "Yes",
        cancelText: "No"
    };

    beforeEach(async () => {
        mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["close"]);

        await TestBed.configureTestingModule({
            imports: [ConfirmationDialogComponent, NoopAnimationsModule, MatIconModule],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockData }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmationDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should display the provided data", () => {
        expect(component.data).toEqual(mockData);
    });

    it("should close dialog with true when confirmed", () => {
        component.onConfirm();
        expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it("should close dialog with false when cancelled", () => {
        component.onCancel();
        expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });
});
