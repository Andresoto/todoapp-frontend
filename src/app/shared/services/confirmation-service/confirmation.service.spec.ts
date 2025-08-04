// eslint-disable-next-line import/no-extraneous-dependencies
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator/jest";
import { of } from "rxjs";

import {
    ConfirmationDialogComponent,
    ConfirmationDialogData
} from "../../components/confirmation-dialog/confirmation-dialog.component";
import { ConfirmationService } from "./confirmation.service";

describe("ConfirmationService", () => {
    let spectator: SpectatorService<ConfirmationService>;
    let service: ConfirmationService;
    let mockDialog: jest.Mocked<MatDialog>;
    let mockDialogRef: jest.Mocked<MatDialogRef<ConfirmationDialogComponent>>;

    const createService = createServiceFactory({
        service: ConfirmationService,
        mocks: [MatDialog]
    });

    beforeEach(() => {
        spectator = createService();
        service = spectator.service;
        mockDialog = spectator.inject(MatDialog);

        // Create mock dialog reference
        mockDialogRef = {
            afterClosed: jest.fn(),
            close: jest.fn(),
            componentInstance: {} as ConfirmationDialogComponent
        } as any;

        mockDialog.open.mockReturnValue(mockDialogRef);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe("openConfirmationDialog", () => {
        it("should open confirmation dialog with correct data", () => {
            const title = "Test Title";
            const description = "Test Description";
            const confirmText = "Yes";
            const cancelText = "No";

            mockDialogRef.afterClosed.mockReturnValue(of(true));

            service.openConfirmationDialog(title, description, confirmText, cancelText);

            expect(mockDialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
                width: "500px",
                maxWidth: "90vw",
                data: {
                    title,
                    description,
                    confirmText,
                    cancelText
                } as ConfirmationDialogData,
                disableClose: true,
                panelClass: "confirmation-dialog"
            });
        });

        it("should return observable from dialog afterClosed", done => {
            const expectedResult = true;
            mockDialogRef.afterClosed.mockReturnValue(of(expectedResult));

            const result = service.openConfirmationDialog("Title", "Description");

            result.subscribe(res => {
                expect(res).toBe(expectedResult);
                done();
            });
        });

        it("should handle dialog returning false", done => {
            mockDialogRef.afterClosed.mockReturnValue(of(false));

            const result = service.openConfirmationDialog("Title", "Description");

            result.subscribe(res => {
                expect(res).toBe(false);
                done();
            });
        });

        it("should handle dialog returning undefined (cancelled)", done => {
            mockDialogRef.afterClosed.mockReturnValue(of(undefined));

            const result = service.openConfirmationDialog("Title", "Description");

            result.subscribe(res => {
                expect(res).toBeUndefined();
                done();
            });
        });

        it("should use default texts when not provided", () => {
            mockDialogRef.afterClosed.mockReturnValue(of(true));

            service.openConfirmationDialog("Title", "Description");

            expect(mockDialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
                width: "500px",
                maxWidth: "90vw",
                data: {
                    title: "Title",
                    description: "Description",
                    confirmText: undefined,
                    cancelText: undefined
                } as ConfirmationDialogData,
                disableClose: true,
                panelClass: "confirmation-dialog"
            });
        });
    });

    describe("confirmDelete", () => {
        it("should open delete confirmation with correct parameters", () => {
            const title = "Eliminar tarea";
            const description = "¿Estás seguro de que deseas eliminar esta tarea?";
            mockDialogRef.afterClosed.mockReturnValue(of(true));

            service.confirmDelete(title, description);

            expect(mockDialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
                width: "500px",
                maxWidth: "90vw",
                data: {
                    title,
                    description,
                    confirmText: "Confirmar",
                    cancelText: "Cancelar"
                } as ConfirmationDialogData,
                disableClose: true,
                panelClass: "confirmation-dialog"
            });
        });

        it("should return observable result from confirmDelete", done => {
            const expectedResult = true;
            mockDialogRef.afterClosed.mockReturnValue(of(expectedResult));

            const result = service.confirmDelete("Test Title", "Test Description");

            result.subscribe(res => {
                expect(res).toBe(expectedResult);
                done();
            });
        });
    });

    describe("confirmSave", () => {
        it("should open save confirmation with predefined parameters", () => {
            mockDialogRef.afterClosed.mockReturnValue(of(true));

            service.confirmSave();

            expect(mockDialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
                width: "500px",
                maxWidth: "90vw",
                data: {
                    title: "Guardar cambios",
                    description: "¿Deseas guardar los cambios realizados?",
                    confirmText: "Guardar",
                    cancelText: "Cancelar"
                } as ConfirmationDialogData,
                disableClose: true,
                panelClass: "confirmation-dialog"
            });
        });

        it("should return observable result from confirmSave", done => {
            const expectedResult = false;
            mockDialogRef.afterClosed.mockReturnValue(of(expectedResult));

            const result = service.confirmSave();

            result.subscribe(res => {
                expect(res).toBe(expectedResult);
                done();
            });
        });
    });

    describe("confirmUnsavedChanges", () => {
        it("should open unsaved changes confirmation with predefined parameters", () => {
            mockDialogRef.afterClosed.mockReturnValue(of(true));

            service.confirmUnsavedChanges();

            expect(mockDialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
                width: "500px",
                maxWidth: "90vw",
                data: {
                    title: "Cambios sin guardar",
                    description: "Tienes cambios sin guardar. ¿Estás seguro de que deseas salir?",
                    confirmText: "Salir sin guardar",
                    cancelText: "Cancelar"
                } as ConfirmationDialogData,
                disableClose: true,
                panelClass: "confirmation-dialog"
            });
        });

        it("should return observable result from confirmUnsavedChanges", done => {
            const expectedResult = true;
            mockDialogRef.afterClosed.mockReturnValue(of(expectedResult));

            const result = service.confirmUnsavedChanges();

            result.subscribe(res => {
                expect(res).toBe(expectedResult);
                done();
            });
        });
    });

    describe("error handling", () => {
        it("should handle dialog open errors gracefully", () => {
            mockDialog.open.mockImplementation(() => {
                throw new Error("Dialog failed to open");
            });

            expect(() => {
                service.openConfirmationDialog("Title", "Description");
            }).toThrow("Dialog failed to open");
        });
    });
});
