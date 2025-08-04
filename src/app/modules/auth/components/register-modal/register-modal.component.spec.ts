import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { RegisterModalComponent } from "./register-modal.component";

describe("RegisterModalComponent", () => {
    let component: RegisterModalComponent;
    let fixture: ComponentFixture<RegisterModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegisterModalComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: "test data" },
                { provide: MatDialogRef, useValue: { close: jest.fn() } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
