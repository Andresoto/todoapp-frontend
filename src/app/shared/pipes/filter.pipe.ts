import { Pipe, PipeTransform } from "@angular/core";

import { Task } from "../../modules/task/interfaces/task.interface";

@Pipe({
    name: "filter",
    standalone: true
})
export class FilterPipe implements PipeTransform {
    transform(tasks: Task[] = [], filter: string = "all"): Task[] {
        if (!tasks || !filter) {
            return tasks;
        }

        return tasks.filter(task => {
            if (filter === "completed") {
                return task.completed;
            }
            if (filter === "pending") {
                return !task.completed;
            }
            return true;
        });
    }
}
