# Analytics con Umami

## Qué es Umami

[Umami](https://umami.is) es una alternativa open-source y privacy-friendly a Google Analytics. No usa cookies, cumple con GDPR/privacidad y se puede self-hostear.

## Opción A: Umami Cloud (más rápido)

1. Crea cuenta en https://cloud.umami.is (hay plan gratis)
2. Agrega tu sitio (`pathogens.cl`)
3. Copia el **Website ID** y la **URL del script**
4. Edita `hugo.yaml`:

```yaml
params:
  umami_website_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  umami_src: "https://cloud.umami.is/script.js"
```

## Opción B: Self-hosted (recomendado para privacidad)

### Requisitos
- Un servidor VPS (o Railway / Fly.io / Render)
- Docker o Node.js 18+

### Con Docker Compose

```yaml
# docker-compose.yml
version: '3'
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://umami:umami@db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: cambia_esto_por_algo_secreto
    depends_on:
      - db
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: umami
    volumes:
      - umami-db-data:/var/lib/postgresql/data
volumes:
  umami-db-data:
```

```bash
docker compose up -d
```

Umami corre en http://tu-servidor:3000
Usuario por defecto: `admin` / `umami`

### Configurar en hugo.yaml

```yaml
params:
  umami_website_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  umami_src: "https://analytics.pathogens.cl/script.js"
```

## Ver métricas

- Dashboard en tiempo real: `https://tu-umami/`
- Puedes crear un **share link** público de las métricas si quieres mostrarlo embebido

## Desactivar en desarrollo

El script de Umami solo se inyecta si `umami_website_id` y `umami_src` están configurados en `hugo.yaml`. Si están vacíos (como en el default), no se carga nada.
