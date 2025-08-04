export interface Task {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt?: Date;
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
