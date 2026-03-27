# CMS Admin — Decap CMS

El portal incluye un CMS visual accesible en `/admin/` que permite editar noticias, highlights, dashboards y eventos sin tocar código.

## Desarrollo local

### Requisitos
- Hugo instalado
- Node.js / npm

### Pasos

```bash
# 1. Instalar el servidor proxy de Decap CMS
npm install -g decap-server

# 2. En una terminal, ejecutar el proxy (puerto 8081)
decap-server

# 3. En otra terminal, ejecutar Hugo
hugo serve

# 4. Abrir el CMS
open http://localhost:1313/admin/
```

> En local **no se necesita autenticación**. El CMS lee y escribe directamente en los archivos del proyecto.

### Cambiar al backend local

Edita `static/admin/config.yml` y comenta/descomenta:

```yaml
backend:
  # name: github          # ← comentar para local
  # repo: johanpina/node-pathogens-portal
  # branch: main
  name: proxy             # ← descomentar para local
  proxy_url: http://localhost:8081/api/v1
```

## Producción (GitHub + Netlify Identity)

El backend de producción usa GitHub como fuente de verdad.

### Configuración
1. El repo debe estar en GitHub (ya lo está)
2. Configurar **Netlify Identity** o **GitHub OAuth App**:
   - En Netlify: activar Identity en el proyecto → habilitar GitHub como provider
   - O crear una GitHub OAuth App en https://github.com/settings/developers

3. Asegurarse que `hugo.yaml` tiene el repo correcto:
   ```yaml
   git_repository: "https://github.com/johanpina/node-pathogens-portal"
   ```

4. El CMS estará en `https://pathogens.cl/admin/`

## Flujo editorial

Con `publish_mode: editorial_workflow` habilitado:

| Estado | Descripción |
|--------|-------------|
| **Draft** | Guardado pero no publicado |
| **In Review** | Listo para revisión |
| **Published** | Genera commit en `main` → despliega |

## Colecciones disponibles

| Colección | Ruta | Archivos |
|-----------|------|---------|
| Noticias | `content/news/` | Markdown |
| Highlights | `content/highlights/` | Markdown |
| Dashboards | `content/dashboards/` | Markdown |
| Eventos | `data/events.json` | JSON (`items` array) |
