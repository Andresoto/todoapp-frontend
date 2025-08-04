import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LoaderComponent } from "./loader.component";

describe("LoaderComponent", () => {
    let component: LoaderComponent;
    let fixture: ComponentFixture<LoaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoaderComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should display default message", () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector(".loader-message")?.textContent).toContain("Cargando...");
    });

    it("should display custom message", () => {
        component.message = "Cargando tareas...";
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector(".loader-message")?.textContent).toContain("Cargando tareas...");
    });

    it("should apply correct size class", () => {
        component.size = "large";
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector(".loader-container")).toHaveClass("loader-large");
    });

    it("should be centered by default", () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector(".loader-container")).toHaveClass("centered");
    });
});
