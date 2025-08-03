import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Task {
    id: string;
    title: string;
    description: string;
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    };
    date: Date;
    completed: boolean;
}

@Injectable({
    providedIn: "root"
})
export class TaskService {
    http = inject(HttpClient);

    url = "https://api-bwdmdhdcyq-uc.a.run.app";

    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.url}/tasks`);
    }

    createTask(task: Task): Observable<Task> {
        return this.http.post<Task>(`${this.url}/tasks`, task);
    }

    updateTask(task: Partial<Task>): Observable<Task> {
        return this.http.patch<Task>(`${this.url}/tasks/${task.id}`, task);
    }

    deleteTask(taskId: string) {
        return this.http.delete(`${this.url}/tasks/${taskId}`);
    }
}
