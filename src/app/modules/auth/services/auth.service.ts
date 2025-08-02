import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface LoginResponse {
    headers: {
        normalizedNames: Record<string, any>;
        lazyUpdate: any | null;
    };
    status: number;
    statusText: string;
    url: string;
    ok: boolean;
    type: number;
    body: User;
}

export interface User {
    id: string;
    email: string;
    nombre: string;
}

@Injectable({
    providedIn: "root"
})
export class AuthService {
    http = inject(HttpClient);
    url = "https://api-bwdmdhdcyq-uc.a.run.app";

    login(email: string): Observable<HttpResponse<LoginResponse["body"]>> {
        return this.http.post<LoginResponse["body"]>(`${this.url}/auth/login`, { email }, { observe: "response" });
    }

    register(email: string): Observable<User> {
        return this.http.post<User>(`${this.url}/auth/register`, { email });
    }
}
