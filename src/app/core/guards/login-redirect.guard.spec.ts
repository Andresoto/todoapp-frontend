import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator/jest";

import { loginRedirectGuard } from "./login-redirect.guard";

describe("loginRedirectGuard", () => {
    let spectator: SpectatorService<any>;
    let mockRouter: any;

    const createService = createServiceFactory({
        service: class MockService {},
        mocks: [Router]
    });

    beforeEach(() => {
        spectator = createService();
        mockRouter = spectator.inject(Router);

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn()
            },
            writable: true
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const executeGuard = () => TestBed.runInInjectionContext(() => loginRedirectGuard({} as any, {} as any));

    it("should be created", () => {
        expect(loginRedirectGuard).toBeTruthy();
    });

    describe("when user is not authenticated", () => {
        it("should return true when userId is null (allow access to login page)", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(null);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });

        it("should return true when userId is undefined (allow access to login page)", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(undefined);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });

        it("should return true when userId is empty string (allow access to login page)", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue("");

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
    });

    describe("when user is already authenticated", () => {
        it("should redirect to tasks and return false when userId exists", () => {
            const userId = "test-user-123";
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/tasks"]);
        });

        it("should redirect to tasks when userId contains special characters", () => {
            const userId = "user@domain.com-123_test";
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/tasks"]);
        });

        it("should redirect to tasks when userId is a number as string", () => {
            const userId = "12345";
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/tasks"]);
        });

        it("should redirect to tasks when userId is a long string", () => {
            const userId = "very-long-user-id-with-many-characters-12345";
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/tasks"]);
        });
    });

    describe("localStorage error handling", () => {
        it("should handle localStorage errors gracefully", () => {
            (localStorage.getItem as jest.Mock).mockImplementation(() => {
                throw new Error("localStorage is not available");
            });

            expect(() => {
                executeGuard();
            }).toThrow("localStorage is not available");
        });
    });

    describe("router navigation", () => {
        it("should call router.navigate with correct path when authenticated", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue("valid-user-id");

            executeGuard();

            expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/tasks"]);
        });

        it("should not call router.navigate when not authenticated", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(null);

            executeGuard();

            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
    });

    describe("integration scenarios", () => {
        it("should work correctly in multiple calls with different userId states", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(null);
            let result = executeGuard();
            expect(result).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();

            jest.clearAllMocks();

            (localStorage.getItem as jest.Mock).mockReturnValue("user-123");
            result = executeGuard();
            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/tasks"]);
        });

        it("should handle edge case where localStorage changes between calls", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue("");
            let result = executeGuard();
            expect(result).toBe(true);

            jest.clearAllMocks();

            (localStorage.getItem as jest.Mock).mockReturnValue("new-user-id");
            result = executeGuard();
            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/tasks"]);
        });
    });
});
