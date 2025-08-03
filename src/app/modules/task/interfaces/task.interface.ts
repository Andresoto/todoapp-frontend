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

export interface TaskFormData {
    id?: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    isEditing?: boolean;
}
