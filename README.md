# Portal Gateway

API Gateway en Node.js + Express + TypeScript para el proyecto [PortalWeb](../PortalWeb) de la Municipalidad de Santo Tomé.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor con hot-reload (ts-node-dev) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Corre la versión compilada |

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/ping` | Verifica que el gateway está operativo |

### Ejemplo de respuesta

```json
{
  "status": "ok",
  "message": "Gateway operativo",
  "timestamp": "2026-06-29T12:00:00.000Z"
}
```

## Configuración

Por defecto corre en el puerto `3001`. Se puede cambiar con la variable de entorno `PORT`.

El CORS está habilitado para `http://localhost:5173` (PortalWeb en desarrollo).
