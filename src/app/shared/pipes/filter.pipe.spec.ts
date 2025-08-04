import { createPipeFactory, SpectatorPipe } from "@ngneat/spectator/jest";

import { Task } from "../../modules/task/interfaces/task.interface";
import { FilterPipe } from "./filter.pipe";

describe("FilterPipe", () => {
    let spectator: SpectatorPipe<FilterPipe>;
    let pipe: FilterPipe;
    let mockTasks: Task[];

    const createPipe = createPipeFactory(FilterPipe);

    beforeEach(() => {
        pipe = new FilterPipe();
        const baseDate = new Date("2022-01-01");
        mockTasks = [
            {
                id: "1",
                title: "Complete project documentation",
                description: "Write comprehensive documentation for the project",
                completed: true,
                createdAt: baseDate
            },
            {
                id: "2",
                title: "Fix bug in authentication",
                description: "Resolve login issues reported by users",
                completed: false,
                createdAt: baseDate
            },
            {
                id: "3",
                title: "Update dependencies",
                description: "Update all npm packages to latest versions",
                completed: true,
                createdAt: baseDate
            },
            {
                id: "4",
                title: "Implement user profile page",
                description: "Create a page where users can edit their profile",
                completed: false,
                createdAt: baseDate
            }
        ];
    });

    it("should create the pipe", () => {
        expect(pipe).toBeTruthy();
    });

    it("should return all tasks when filter is 'all'", () => {
        const result = pipe.transform(mockTasks, "all");
        expect(result).toEqual(mockTasks);
        expect(result.length).toBe(4);
    });

    it("should return only completed tasks when filter is 'completed'", () => {
        const result = pipe.transform(mockTasks, "completed");
        const expectedTasks = mockTasks.filter((task: Task) => task.completed);
        expect(result).toEqual(expectedTasks);
        expect(result.length).toBe(2);
        expect(result.every((task: Task) => task.completed)).toBe(true);
    });

    it("should return only pending tasks when filter is 'pending'", () => {
        const result = pipe.transform(mockTasks, "pending");
        const expectedTasks = mockTasks.filter((task: Task) => !task.completed);
        expect(result).toEqual(expectedTasks);
        expect(result.length).toBe(2);
        expect(result.every((task: Task) => !task.completed)).toBe(true);
    });

    it("should return all tasks when filter is empty string", () => {
        const result = pipe.transform(mockTasks, "");
        expect(result).toEqual(mockTasks);
    });

    it("should return all tasks when filter is undefined", () => {
        const result = pipe.transform(mockTasks, undefined as any);
        expect(result).toEqual(mockTasks);
    });

    it("should return empty array when tasks array is empty", () => {
        const result = pipe.transform([], "completed");
        expect(result).toEqual([]);
    });

    it("should return tasks when tasks array is null", () => {
        const result = pipe.transform(null as any, "completed");
        expect(result).toBeNull();
    });

    it("should handle unknown filter values by returning all tasks", () => {
        const result = pipe.transform(mockTasks, "unknown");
        expect(result).toEqual(mockTasks);
        expect(result.length).toBe(4);
    });

    it("should work with default parameters", () => {
        const result = pipe.transform();
        expect(result).toEqual([]);
    });

    it("should handle empty tasks array in template", () => {
        spectator = createPipe("<div>{{ tasks | filter:'completed' | json }}</div>", {
            hostProps: {
                tasks: []
            }
        });

        expect(spectator.element).toContainText("[]");
    });
});
