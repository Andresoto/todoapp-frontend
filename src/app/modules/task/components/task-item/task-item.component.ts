import { DatePipe, NgClass } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";

import { Task } from "../../services/task.service";

@Component({
    selector: "app-task-item",
    standalone: true,
    imports: [FormsModule, DatePipe, MatCheckboxModule, MatIconModule, NgClass],
    templateUrl: "./task-item.component.html",
    styleUrl: "./task-item.component.scss"
})
export class TaskItemComponent {
    @Input() task!: Task;
    @Output() toggleComplete = new EventEmitter<Task>();
    @Output() edit = new EventEmitter<Task>();
    @Output() delete = new EventEmitter<string>();

    getDateBadgeClass(): string {
        if (!this.task.completed) return "badge-primary";
        return "badge-destructive";
    }
}
