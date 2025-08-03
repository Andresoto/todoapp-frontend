import { Routes } from "@angular/router";

import { authGuardTsGuard } from "./core/guards/auth.guard.ts.guard";
import { loginRedirectGuard } from "./core/guards/login-redirect.guard";

export const routes: Routes = [
    {
        path: "home",
        loadComponent: () => import("./modules/example-page/example-page.component").then(m => m.ExamplePageComponent)
    },
    {
        path: "login",
        loadComponent: () => import("./modules/auth/pages/login/login.component").then(m => m.LoginComponent),
        canActivate: [loginRedirectGuard]
    },
    {
        path: "tasks",
        loadComponent: () =>
            import("./modules/task/pages/todo-list/todo-list.component").then(m => m.TodoListComponent),
        canActivate: [authGuardTsGuard]
    },
    {
        path: "**",
        redirectTo: "/login",
        pathMatch: "full"
    }
];
