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
