import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuardTsGuard: CanActivateFn = () => {
    const router = inject(Router);
    const userId = localStorage.getItem("userId");
    if (!userId) {
        router.navigate(["/login"]);
        return false;
    }
    return true;
};
