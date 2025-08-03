import { HttpInterceptorFn } from "@angular/common/http";

export const userIdInterceptor: HttpInterceptorFn = (req, next) => {
    const userId = localStorage.getItem("userId");

    if (userId) {
        const modifiedReq = req.clone({
            setHeaders: {
                "user-id": userId
            }
        });

        return next(modifiedReq);
    }

    return next(req);
};
