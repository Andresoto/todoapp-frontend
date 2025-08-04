import { MatSnackBar, MatSnackBarRef } from "@angular/material/snack-bar";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator/jest";

import { ToastService } from "./toast.service";

describe("ToastService", () => {
    let spectator: SpectatorService<ToastService>;
    let service: ToastService;
    let mockSnackBar: any;
    let mockSnackBarRef: jest.Mocked<MatSnackBarRef<any>>;

    const createService = createServiceFactory({
        service: ToastService,
        mocks: [MatSnackBar]
    });

    beforeEach(() => {
        spectator = createService();
        service = spectator.service;
        mockSnackBar = spectator.inject(MatSnackBar);

        mockSnackBarRef = {
            dismiss: jest.fn(),
            dismissWithAction: jest.fn(),
            onAction: jest.fn(),
            afterDismissed: jest.fn(),
            instance: {}
        } as any;

        mockSnackBar.open.mockReturnValue(mockSnackBarRef);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe("showSuccess", () => {
        it("should open snack bar with success configuration", () => {
            const message = "Operation successful!";

            service.showSuccess(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["success-toast"]
            });
        });

        it("should handle empty message", () => {
            const message = "";

            service.showSuccess(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["success-toast"]
            });
        });

        it("should handle long message", () => {
            const message =
                "This is a very long success message that should still work properly " +
                "with the toast service implementation";

            service.showSuccess(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["success-toast"]
            });
        });
    });

    describe("showError", () => {
        it("should open snack bar with error configuration", () => {
            const message = "Something went wrong!";

            service.showError(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["error-toast"]
            });
        });

        it("should handle error message with special characters", () => {
            const message = "Error: Couldn't save data! @#$%^&*()";

            service.showError(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["error-toast"]
            });
        });
    });

    describe("showInfo", () => {
        it("should open snack bar with info configuration", () => {
            const message = "Here's some information";

            service.showInfo(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["info-toast"]
            });
        });

        it("should handle info message with HTML entities", () => {
            const message = "User <test@example.com> logged in successfully";

            service.showInfo(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["info-toast"]
            });
        });
    });

    describe("showWarning", () => {
        it("should open snack bar with warning configuration", () => {
            const message = "This is a warning!";

            service.showWarning(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["warning-toast"]
            });
        });

        it("should handle warning message with numbers", () => {
            const message = "Warning: 5 items will be deleted";

            service.showWarning(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["warning-toast"]
            });
        });
    });

    describe("default configuration", () => {
        it("should use consistent default configuration across all toast types", () => {
            const message = "Test message";
            const expectedBaseConfig = {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top"
            };

            service.showSuccess(message);
            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                ...expectedBaseConfig,
                panelClass: ["success-toast"]
            });

            service.showError(message);
            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                ...expectedBaseConfig,
                panelClass: ["error-toast"]
            });

            service.showInfo(message);
            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                ...expectedBaseConfig,
                panelClass: ["info-toast"]
            });

            service.showWarning(message);
            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                ...expectedBaseConfig,
                panelClass: ["warning-toast"]
            });

            expect(mockSnackBar.open).toHaveBeenCalledTimes(4);
        });
    });

    describe("integration with MatSnackBar", () => {
        it("should call MatSnackBar open method for all toast types", () => {
            const message = "Test message";

            service.showSuccess(message);
            service.showError(message);
            service.showInfo(message);
            service.showWarning(message);

            expect(mockSnackBar.open).toHaveBeenCalledTimes(4);
        });

        it("should handle MatSnackBar open method errors gracefully", () => {
            const message = "Test message";
            mockSnackBar.open.mockImplementation(() => {
                throw new Error("SnackBar failed to open");
            });

            expect(() => {
                service.showSuccess(message);
            }).toThrow("SnackBar failed to open");
        });
    });

    describe("edge cases", () => {
        it("should handle null message", () => {
            const message = null as any;

            service.showSuccess(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["success-toast"]
            });
        });

        it("should handle undefined message", () => {
            const message = undefined as any;

            service.showError(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["error-toast"]
            });
        });

        it("should handle message with only whitespace", () => {
            const message = "   \n\t   ";

            service.showInfo(message);

            expect(mockSnackBar.open).toHaveBeenCalledWith(message, undefined, {
                duration: 4000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ["info-toast"]
            });
        });
    });
});
