import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator/jest";

import { authGuardTsGuard } from "./auth.guard.ts.guard";

describe("authGuardTsGuard", () => {
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

    const executeGuard = () => TestBed.runInInjectionContext(() => authGuardTsGuard({} as any, {} as any));

    it("should be created", () => {
        expect(authGuardTsGuard).toBeTruthy();
    });

    describe("when user is authenticated", () => {
        it("should return true when userId exists in localStorage", () => {
            const userId = "test-user-123";
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });

        it("should redirect to login when userId is empty string (falsy)", () => {
            const userId = "";
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
        });

        it("should return true when userId contains special characters", () => {
            const userId = "user@domain.com-123_test";
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });

        it("should return true when userId is a number as string", () => {
            const userId = "12345";
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
    });

    describe("when user is not authenticated", () => {
        it("should redirect to login and return false when userId is null", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(null);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
        });

        it("should redirect to login and return false when userId is undefined", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(undefined);

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
        });

        it("should redirect to login and return false when userId is empty string", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue("");

            const result = executeGuard();

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
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
        it("should call router.navigate with correct path when not authenticated", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(null);

            executeGuard();

            expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
        });

        it("should not call router.navigate when authenticated", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue("valid-user-id");

            executeGuard();

            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
    });

    describe("integration scenarios", () => {
        it("should work correctly in multiple calls with different userId states", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue("user-123");
            let result = executeGuard();
            expect(result).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();

            jest.clearAllMocks();

            (localStorage.getItem as jest.Mock).mockReturnValue(null);
            result = executeGuard();
            expect(result).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
        });
    });
});
