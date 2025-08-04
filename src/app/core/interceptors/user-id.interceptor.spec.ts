import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { userIdInterceptor } from "./user-id.interceptor";

describe("userIdInterceptor", () => {
    let mockNext: jest.MockedFunction<HttpHandlerFn>;
    let mockRequest: HttpRequest<any>;

    const executeInterceptor = (req: HttpRequest<any>, next: HttpHandlerFn) =>
        TestBed.runInInjectionContext(() => userIdInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({});

        mockNext = jest.fn();

        mockRequest = new HttpRequest("GET", "/api/test");

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn()
            },
            writable: true
        });

        const mockResponse = new HttpResponse({ status: 200, body: {} });
        mockNext.mockReturnValue(of(mockResponse));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be created", () => {
        const interceptor: HttpInterceptorFn = (req, next) => executeInterceptor(req, next);
        expect(interceptor).toBeTruthy();
    });

    describe("when userId exists in localStorage", () => {
        it("should add user-id header to the request", () => {
            const userId = "test-user-123";
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            executeInterceptor(mockRequest, mockNext);

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(mockNext).toHaveBeenCalledTimes(1);

            const modifiedRequest = mockNext.mock.calls[0][0] as HttpRequest<any>;
            expect(modifiedRequest.headers.get("user-id")).toBe(userId);
        });

        it("should preserve existing headers when adding user-id", () => {
            const userId = "test-user-456";
            const requestWithHeaders = mockRequest.clone({
                setHeaders: {
                    "Content-Type": "application/json"
                }
            });
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            executeInterceptor(requestWithHeaders, mockNext);

            const modifiedRequest = mockNext.mock.calls[0][0] as HttpRequest<any>;
            expect(modifiedRequest.headers.get("user-id")).toBe(userId);
            expect(modifiedRequest.headers.get("Content-Type")).toBe("application/json");
        });

        it("should override existing user-id header if present", () => {
            const oldUserId = "old-user-id";
            const newUserId = "new-user-id";
            const requestWithUserId = mockRequest.clone({
                setHeaders: {
                    "user-id": oldUserId
                }
            });
            (localStorage.getItem as jest.Mock).mockReturnValue(newUserId);

            executeInterceptor(requestWithUserId, mockNext);

            const modifiedRequest = mockNext.mock.calls[0][0] as HttpRequest<any>;
            expect(modifiedRequest.headers.get("user-id")).toBe(newUserId);
        });

        it("should handle special characters in userId", () => {
            const userId = "user@domain.com-123_test";
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            executeInterceptor(mockRequest, mockNext);

            const modifiedRequest = mockNext.mock.calls[0][0] as HttpRequest<any>;
            expect(modifiedRequest.headers.get("user-id")).toBe(userId);
        });
    });

    describe("when userId does not exist in localStorage", () => {
        it("should pass the original request unchanged when userId is null", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(null);

            executeInterceptor(mockRequest, mockNext);

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(mockNext).toHaveBeenCalledWith(mockRequest);
        });

        it("should pass the original request unchanged when userId is undefined", () => {
            (localStorage.getItem as jest.Mock).mockReturnValue(undefined);

            executeInterceptor(mockRequest, mockNext);

            expect(localStorage.getItem).toHaveBeenCalledWith("userId");
            expect(mockNext).toHaveBeenCalledWith(mockRequest);
        });

        it("should preserve all existing headers when no userId is found", () => {
            const requestWithHeaders = mockRequest.clone({
                setHeaders: {
                    "Content-Type": "application/json",
                    "X-Custom-Header": "custom-value"
                }
            });
            (localStorage.getItem as jest.Mock).mockReturnValue(null);

            executeInterceptor(requestWithHeaders, mockNext);

            expect(mockNext).toHaveBeenCalledWith(requestWithHeaders);
        });
    });

    describe("different HTTP methods", () => {
        it("should work with POST requests", () => {
            const userId = "post-user-123";
            const postRequest = new HttpRequest("POST", "/api/create", { data: "test" });
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            executeInterceptor(postRequest, mockNext);

            const modifiedRequest = mockNext.mock.calls[0][0] as HttpRequest<any>;
            expect(modifiedRequest.headers.get("user-id")).toBe(userId);
            expect(modifiedRequest.method).toBe("POST");
        });

        it("should work with PUT requests", () => {
            const userId = "put-user-456";
            const putRequest = new HttpRequest("PUT", "/api/update/1", { data: "updated" });
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            executeInterceptor(putRequest, mockNext);

            const modifiedRequest = mockNext.mock.calls[0][0] as HttpRequest<any>;
            expect(modifiedRequest.headers.get("user-id")).toBe(userId);
            expect(modifiedRequest.method).toBe("PUT");
        });

        it("should work with DELETE requests", () => {
            const userId = "delete-user-789";
            const deleteRequest = new HttpRequest("DELETE", "/api/delete/1");
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);

            executeInterceptor(deleteRequest, mockNext);

            const modifiedRequest = mockNext.mock.calls[0][0] as HttpRequest<any>;
            expect(modifiedRequest.headers.get("user-id")).toBe(userId);
            expect(modifiedRequest.method).toBe("DELETE");
        });
    });

    describe("error handling", () => {
        it("should handle localStorage errors gracefully", () => {
            (localStorage.getItem as jest.Mock).mockImplementation(() => {
                throw new Error("localStorage is not available");
            });

            expect(() => {
                executeInterceptor(mockRequest, mockNext);
            }).toThrow("localStorage is not available");
        });

        it("should return the observable from next handler", done => {
            const userId = "observable-test-user";
            const mockResponse = new HttpResponse({ status: 200, body: { data: "test response" } });
            (localStorage.getItem as jest.Mock).mockReturnValue(userId);
            mockNext.mockReturnValue(of(mockResponse));

            const result = executeInterceptor(mockRequest, mockNext);

            result.subscribe(response => {
                expect(response).toEqual(mockResponse);
                done();
            });
        });
    });
});
