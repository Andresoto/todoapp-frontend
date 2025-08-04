import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";

import {
    ConfirmationDialogComponent,
    ConfirmationDialogData
} from "../../components/confirmation-dialog/confirmation-dialog.component";

@Injectable({
    providedIn: "root"
})
export class ConfirmationService {
    constructor(private dialog: MatDialog) {}

    /**
     * Abre un modal de confirmación
     * @param title - Título del modal
     * @param description - Descripción de la acción a realizar
     * @param confirmText - Texto del botón de confirmación (opcional, por defecto "Confirmar")
     * @param cancelText - Texto del botón de cancelación (opcional, por defecto "Cancelar")
     * @returns Observable<boolean> - true si se confirma, false si se cancela
     */
    openConfirmationDialog(
        title: string,
        description: string,
        confirmText?: string,
        cancelText?: string
    ): Observable<boolean> {
        const dialogData: ConfirmationDialogData = {
            title,
            description,
            confirmText,
            cancelText
        };

        const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, {
            width: "500px",
            maxWidth: "90vw",
            data: dialogData,
            disableClose: true,
            panelClass: "confirmation-dialog"
        });

        return dialogRef.afterClosed();
    }

    /**
     * Método de conveniencia para confirmar eliminación
     * @param itemName - Nombre del elemento a eliminar
     * @returns Observable<boolean>
     */
    confirmDelete(title: string, description: string): Observable<boolean> {
        return this.openConfirmationDialog(title, description, "Confirmar", "Cancelar");
    }

    /**
     * Método de conveniencia para confirmar guardar cambios
     * @returns Observable<boolean>
     */
    confirmSave(): Observable<boolean> {
        return this.openConfirmationDialog(
            "Guardar cambios",
            "¿Deseas guardar los cambios realizados?",
            "Guardar",
            "Cancelar"
        );
    }

    /**
     * Método de conveniencia para confirmar salir sin guardar
     * @returns Observable<boolean>
     */
    confirmUnsavedChanges(): Observable<boolean> {
        return this.openConfirmationDialog(
            "Cambios sin guardar",
            "Tienes cambios sin guardar. ¿Estás seguro de que deseas salir?",
            "Salir sin guardar",
            "Cancelar"
        );
    }
}
