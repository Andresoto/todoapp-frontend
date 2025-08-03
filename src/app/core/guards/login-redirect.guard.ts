import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const loginRedirectGuard: CanActivateFn = () => {
    const router = inject(Router);
    const userId = localStorage.getItem("userId");
    if (userId) {
        router.navigate(["/tasks"]);
        return false;
    }
    return true;
};
