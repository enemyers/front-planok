# PlanOK - Frontend Angular con Tailwind CSS y JWT

## Características

- **Angular 20**: Utiliza la última versión estable de Angular con componentes standalone
- **Tailwind CSS**: Framework de CSS utilitario para un diseño moderno y responsive
- **Autenticación JWT**: Implementación completa de login con JWT, incluyendo refresh token
- **Arquitectura modular**: Organización del código siguiendo principios SOLID
- **Lazy loading**: Carga diferida de módulos para optimizar el rendimiento
- **Formularios reactivos**: Validación y manejo de formularios con ReactiveFormsModule
- **Gestión de proyectos**: CRUD completo de proyectos con listado, detalle, creación y edición

## Estructura del proyecto

```
src/
├── app/
│   ├── core/               # Servicios, modelos, guardias e interceptores
│   │   ├── guards/         # Guardias de rutas
│   │   ├── interceptors/   # Interceptores HTTP
│   │   ├── models/         # Interfaces y modelos
│   │   └── services/       # Servicios compartidos
│   ├── features/           # Componentes de características
│   │   ├── auth/           # Componentes de autenticación
│   │   └── dashboard/      # Componentes del dashboard
│   └── shared/             # Componentes, directivas y pipes compartidos
├── assets/                 # Recursos estáticos
└── environments/           # Configuraciones de entorno
```

## Requisitos previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI (v20.0.3)

## Instalación

1. Clona este repositorio
2. Instala las dependencias:

```bash
npm install
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
ng serve
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

## Conexión con el backend

La aplicación está configurada para conectarse a un backend en `http://localhost:8000/api`. Puedes modificar esta URL en el archivo `src/environments/environment.ts`.

## Autenticación

La aplicación utiliza JWT para la autenticación. El flujo incluye:

1. Login con credenciales de usuario
2. Almacenamiento seguro de tokens
3. Refresh automático de tokens
4. Interceptor HTTP para añadir el token a las peticiones
5. Protección de rutas con guardias

## Construcción

Para construir el proyecto para producción:

```bash
ng build --configuration production
```

Los archivos de construcción se almacenarán en el directorio `dist/`.

## Pruebas

Para ejecutar las pruebas unitarias:

```bash
ng test
```

Para ejecutar las pruebas end-to-end:

```bash
ng e2e
```
Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
