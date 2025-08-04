import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    selector: "app-loader",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./loader.component.html",
    styleUrls: ["./loader.component.scss"]
})
export class LoaderComponent {
    @Input() message: string = "Cargando...";
    @Input() size: "small" | "medium" | "large" = "medium";
    @Input() centered: boolean = true;
}
