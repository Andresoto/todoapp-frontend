# TodoApp Frontend - Angular

Una aplicación moderna de gestión de tareas construida con Angular 17.3.6, con una interfaz limpia usando Angular Material y capacidades completas de gestión de tareas.

## 🛠️ Stack Tecnológico

- **Framework**: Angular 17.3.6 (Componentes Standalone)
- **Librería UI**: Angular Material
- **Gestión de Estado**: Angular Signals
- **Cliente HTTP**: Angular HttpClient con interceptores
- **Enrutamiento**: Angular Router con guardias
- **Testing**: Jest + Spectator
- **Tipado**: TypeScript con modo estricto
- **Herramienta de Build**: Angular CLI
- **Estilos**: SCSS con temas de Angular Material

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Funcionalidad principal
│   │   ├── guards/             # Guardias de rutas (auth, login-redirect)
│   │   └── interceptors/       # Interceptores HTTP (user-id)
│   ├── modules/
│   │   ├── auth/               # Módulo de autenticación
│   │   │   ├── components/     # Modal de registro
│   │   │   ├── pages/          # Página de login
│   │   │   └── services/       # Servicio de autenticación
│   │   └── task/               # Módulo de gestión de tareas
│   │       ├── components/     # Item de tarea, modal de formulario
│   │       ├── pages/          # Página de lista de tareas
│   │       ├── services/       # Servicio de tareas
│   │       └── interfaces/     # Interfaces de tareas
│   ├── shared/                 # Componentes y servicios compartidos
│   │   ├── components/         # Loader, diálogo de confirmación
│   │   ├── pipes/              # Pipe de filtrado
│   │   └── services/           # Servicios de toast y confirmación
│   └── assets/                 # Assets estáticos
```

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Andresoto/todoapp-frontend.git
   cd todoapp-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   ng serve
   ```

4. **Abrir en el navegador**
   Navegar a `http://localhost:4200/`

## 🧪 Testing

El proyecto utiliza Jest y Spectator para testing completo:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## 🏗️ Build

```bash
ng build
```

## Decisiones de Diseño

- **Componentes Standalone**: Usando componentes standalone de Angular 17 para mejor tree-shaking
- **Signals**: Aprovechando Angular Signals para gestión de estado reactiva
- **Material Design**: UI consistente con componentes de Angular Material
- **UI Optimista**: Actualizaciones inmediatas de UI con rollback en errores
- **Diálogos de Confirmación**: Confirmaciones amigables para acciones destructivas
- **Notificaciones Toast**: Feedback claro para todas las acciones del usuario

## Estrategia de Testing

- **Pruebas Unitarias**: Jest + Spectator para testing de componentes y servicios
- **Mocking**: Mocking completo de servicios con SpyObject
- **Cobertura**: Alta cobertura de pruebas para funcionalidad crítica
- **Integración**: Testing de integración de componentes con dependencias apropiadas

## Integración con API

- Integración con API RESTful usando HttpClient
- Inyección automática de ID de usuario vía interceptores HTTP
- Manejo de errores con mensajes amigables al usuario
- Estados de carga para mejor UX

## Características de Rendimiento

- **Lazy Loading**: División de código basada en rutas
- **Estrategia OnPush**: Detección de cambios optimizada
- **Valores Computados**: Propiedades computadas reactivas con Signals
- **Tree Shaking**: Tamaño de bundle optimizado con componentes standalone

