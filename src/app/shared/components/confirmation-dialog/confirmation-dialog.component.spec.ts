import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { createComponentFactory, Spectator } from "@ngneat/spectator/jest";

import { ConfirmationDialogComponent, ConfirmationDialogData } from "./confirmation-dialog.component";

describe("ConfirmationDialogComponent", () => {
    let spectator: Spectator<ConfirmationDialogComponent>;
    let mockDialogRef: jest.Mocked<MatDialogRef<ConfirmationDialogComponent>>;

    const mockData: ConfirmationDialogData = {
        title: "Test Title",
        description: "Test Description",
        confirmText: "Yes",
        cancelText: "No"
    };

    const createComponent = createComponentFactory({
        component: ConfirmationDialogComponent,
        imports: [NoopAnimationsModule, MatIconModule],
        mocks: [MatDialogRef],
        providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }]
    });

    beforeEach(() => {
        spectator = createComponent();
        mockDialogRef = spectator.inject(MatDialogRef);
    });

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });

    it("should display the provided data", () => {
        expect(spectator.component.data).toEqual(mockData);
    });

    it("should display title in the template", () => {
        expect(spectator.query("h2")).toHaveText(mockData.title);
    });

    it("should display description in the template", () => {
        expect(spectator.query("p")).toHaveText(mockData.description);
    });

    it("should display custom confirm button text", () => {
        const confirmButton = spectator.query("button[color='primary']") as HTMLButtonElement;
        expect(confirmButton).toHaveText(mockData.confirmText!);
    });

    it("should display custom cancel button text", () => {
        const cancelButton = spectator.query("button:not([color])") as HTMLButtonElement;
        expect(cancelButton).toHaveText(mockData.cancelText!);
    });

    it("should close dialog with true when confirmed", () => {
        spectator.component.onConfirm();
        expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it("should close dialog with false when cancelled", () => {
        spectator.component.onCancel();
        expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it("should call onConfirm when confirm button is clicked", () => {
        const onConfirmSpy = jest.spyOn(spectator.component, "onConfirm");

        spectator.click("button[color='primary']");

        expect(onConfirmSpy).toHaveBeenCalled();
        expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it("should call onCancel when cancel button is clicked", () => {
        const onCancelSpy = jest.spyOn(spectator.component, "onCancel");

        spectator.click("button:not([color])");

        expect(onCancelSpy).toHaveBeenCalled();
        expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it("should call onCancel when close icon is clicked", () => {
        const onCancelSpy = jest.spyOn(spectator.component, "onCancel");

        spectator.click("mat-icon");

        expect(onCancelSpy).toHaveBeenCalled();
        expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });
});

describe("ConfirmationDialogComponent with default button texts", () => {
    let spectator: Spectator<ConfirmationDialogComponent>;

    const mockDataWithDefaults: ConfirmationDialogData = {
        title: "Default Title",
        description: "Default Description"
    };

    const createComponentWithDefaults = createComponentFactory({
        component: ConfirmationDialogComponent,
        imports: [NoopAnimationsModule, MatIconModule],
        mocks: [MatDialogRef],
        providers: [{ provide: MAT_DIALOG_DATA, useValue: mockDataWithDefaults }]
    });

    beforeEach(() => {
        spectator = createComponentWithDefaults();
    });

    it("should handle undefined confirmText", () => {
        expect(spectator.component.data.confirmText).toBeUndefined();
    });

    it("should handle undefined cancelText", () => {
        expect(spectator.component.data.cancelText).toBeUndefined();
    });

    it("should display default confirm button text", () => {
        const confirmButton = spectator.query("button[color='primary']") as HTMLButtonElement;
        expect(confirmButton).toHaveText("Confirmar");
    });

    it("should display default cancel button text", () => {
        const cancelButton = spectator.query("button:not([color])") as HTMLButtonElement;
        expect(cancelButton).toHaveText("Cancelar");
    });
});

describe("ConfirmationDialogComponent edge cases", () => {
    describe("empty title", () => {
        let spectator: Spectator<ConfirmationDialogComponent>;

        const emptyTitleData: ConfirmationDialogData = {
            title: "",
            description: "Test Description"
        };

        const createComponentEmptyTitle = createComponentFactory({
            component: ConfirmationDialogComponent,
            imports: [NoopAnimationsModule, MatIconModule],
            mocks: [MatDialogRef],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: emptyTitleData }]
        });

        beforeEach(() => {
            spectator = createComponentEmptyTitle();
        });

        it("should handle empty title", () => {
            expect(spectator.component.data.title).toBe("");
        });
    });

    describe("empty description", () => {
        let spectator: Spectator<ConfirmationDialogComponent>;

        const emptyDescData: ConfirmationDialogData = {
            title: "Test Title",
            description: ""
        };

        const createComponentEmptyDesc = createComponentFactory({
            component: ConfirmationDialogComponent,
            imports: [NoopAnimationsModule, MatIconModule],
            mocks: [MatDialogRef],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: emptyDescData }]
        });

        beforeEach(() => {
            spectator = createComponentEmptyDesc();
        });

        it("should handle empty description", () => {
            expect(spectator.component.data.description).toBe("");
        });
    });

    describe("long text content", () => {
        let spectator: Spectator<ConfirmationDialogComponent>;

        const longTextData: ConfirmationDialogData = {
            title: "This is a very long title that might wrap to multiple lines in the dialog",
            description:
                "This is a very long description that contains multiple sentences and might wrap to " +
                "several lines. It should still display correctly in the dialog component without " +
                "breaking the layout or functionality.",
            confirmText: "Very Long Confirm Button Text",
            cancelText: "Very Long Cancel Button Text"
        };

        const createComponentLongText = createComponentFactory({
            component: ConfirmationDialogComponent,
            imports: [NoopAnimationsModule, MatIconModule],
            mocks: [MatDialogRef],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: longTextData }]
        });

        beforeEach(() => {
            spectator = createComponentLongText();
        });

        it("should handle long text content", () => {
            expect(spectator.component.data.title).toBe(longTextData.title);
            expect(spectator.component.data.description).toBe(longTextData.description);
        });
    });

    describe("special characters", () => {
        let spectator: Spectator<ConfirmationDialogComponent>;

        const specialCharsData: ConfirmationDialogData = {
            title: "Title with <HTML> & special chars @#$%",
            description: "Description with 'quotes' and \"double quotes\" & symbols",
            confirmText: "Confirm & Save",
            cancelText: "Cancel & Exit"
        };

        const createComponentSpecialChars = createComponentFactory({
            component: ConfirmationDialogComponent,
            imports: [NoopAnimationsModule, MatIconModule],
            mocks: [MatDialogRef],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: specialCharsData }]
        });

        beforeEach(() => {
            spectator = createComponentSpecialChars();
        });

        it("should handle special characters in text", () => {
            expect(spectator.component.data.title).toBe(specialCharsData.title);
            expect(spectator.component.data.description).toBe(specialCharsData.description);
        });
    });
});

describe("ConfirmationDialogComponent accessibility", () => {
    let spectator: Spectator<ConfirmationDialogComponent>;

    const mockData: ConfirmationDialogData = {
        title: "Accessibility Test",
        description: "Testing accessibility features"
    };

    const createComponentAccessibility = createComponentFactory({
        component: ConfirmationDialogComponent,
        imports: [NoopAnimationsModule, MatIconModule],
        mocks: [MatDialogRef],
        providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }]
    });

    beforeEach(() => {
        spectator = createComponentAccessibility();
    });

    it("should have proper dialog title", () => {
        expect(spectator.query("h2[mat-dialog-title]")).toBeTruthy();
    });

    it("should have dialog content", () => {
        expect(spectator.query("mat-dialog-content")).toBeTruthy();
    });

    it("should have accessible close icon", () => {
        const closeIcon = spectator.query("mat-icon");
        expect(closeIcon).toHaveAttribute("aria-label", "close");
        expect(closeIcon).toHaveAttribute("aria-hidden", "false");
    });

    it("should have accessible button labels", () => {
        const confirmButton = spectator.query("button[color='primary']") as HTMLButtonElement;
        const cancelButton = spectator.query("button:not([color])") as HTMLButtonElement;

        expect(confirmButton).toBeTruthy();
        expect(cancelButton).toBeTruthy();
        expect(confirmButton.tagName).toBe("BUTTON");
        expect(cancelButton.tagName).toBe("BUTTON");
    });
});
