# canchas-frontend · Angular 21

Alternativa a las páginas Thymeleaf: consume la misma API REST de `canchas-backend` (`/api/...`). Sin librerías extra: *standalone components*, *signals*, formularios reactivos y carga perezosa de rutas.

```powershell
npm install
npm start        # http://localhost:4202  (proxy de /api hacia http://localhost:8085)
npm run build
```

Requiere el backend encendido en el puerto 8085.

```
src/app
├── core/          api/ (únicas rutas HTTP) · models/ · interceptors/error.interceptor.ts
├── shared/        ui/ (avisos toast) · util/ (formato de fechas, horas y pesos)
└── features/
    ├── disponibilidad/   horas libres por cancha
    ├── arrendar/         formulario reactivo
    ├── mis-arriendos/    lista, modificar y cancelar
    └── admin/            canchas (crear, editar, activar) · arriendos (ver, filtrar, cancelar)
```

**Pronóstico del clima (ampliación opcional):** `disponibilidad.page` ya incluye el bloque del clima (`core/models/clima.model.ts`, `core/api/clima.api.ts`). Necesita el endpoint `/api/clima` del backend (ver [`../docs/11-guia-api-clima-paso-a-paso.md`](../docs/11-guia-api-clima-paso-a-paso.md)). **Sin esa ampliación en el backend el bloque muestra «Pronóstico no disponible por ahora» y el resto de la pantalla funciona igual.**

La disponibilidad, los precios y los errores **vienen del backend**: el frontend no repite reglas de negocio. Documentación: [`../docs/02-diseno-arquitectura.md`](../docs/02-diseno-arquitectura.md) §7.
