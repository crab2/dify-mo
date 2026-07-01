# Custom UI Deployment

This fork keeps the official Dify project structure and layers the UI changes on top of the existing frontend design system.

## What Changed

- `web/app/styles/custom-brand.css` overrides Dify semantic tokens with an Ant Design aligned palette:
  - primary action color: `#1677FF`
  - hover/action color: `#4096FF`
  - active color: `#0958D9`
  - neutral page and panel backgrounds for dense enterprise workflows
  - success, warning, and error colors aligned to common Ant Design status colors
- The main shell follows an Ant Design enterprise layout direction: fixed left navigation, a dynamic right-side work area, 8px-oriented spacing, clear current-navigation feedback, and card surfaces with stronger hierarchy.
- `web/app/components/main-nav/layout.tsx`, `web/app/components/main-nav/index.tsx`, and `web/app/components/header/header-wrapper.tsx` add brand layout styling without changing business logic.
- `web/app/signin/*`, `web/app/install/*`, and `web/hooks/use-document-title.ts` apply the same skin to the unauthenticated pages, so the Docker first screen shows `MO AI` instead of the default Dify title.
- Template cards, studio app cards, and starred app cards receive the custom brand card treatment while preserving their click handlers, permissions, menus, and routing behavior.
- `web/public/logo/logo.svg` and `web/public/logo/logo-monochrome-white.svg` are temporary `MO AI` placeholder logos.
- `web/app/layout.tsx`, `web/public/manifest.json`, and `web/public/browserconfig.xml` update browser theme metadata to the customized blue.
- `docker/docker-compose.yaml` builds the customized frontend image from this source tree by default, so the official Docker Compose quick-start flow works after cloning this fork.
- `docker/docker-compose.custom.yaml` keeps optional domestic registry mirror overrides for deployments that need them.
- `docker/docker-compose.prebuilt-web.yaml` and `web/Dockerfile.prebuilt` provide a low-memory build path that packages host-generated frontend artifacts into the same `dify-mo-web:latest` runtime image.

## Local Docker Compose Deployment

Clone this fork and run the same Docker Compose flow as the official Dify quick start:

```bash
git clone https://github.com/crab2/dify-mo.git
cd dify-mo/docker
cp .env.example .env
docker compose up -d
```

The default `web` service builds and runs `dify-mo-web:latest` from the repository source, so the custom UI is included without an extra Compose override.

If you need domestic registry mirrors for dependency images, use the optional override from the `docker` directory:

```bash
docker compose -f docker-compose.yaml -f docker-compose.custom.yaml up -d --build --force-recreate
```

`docker-compose.custom.yaml` rewrites Docker image pulls to domestic registry proxy endpoints, which avoids direct access to `registry-1.docker.io` for images such as `redis:6-alpine`, `busybox:latest`, `postgres:15-alpine`, and the Dify service images.

If the page still shows the official Dify logo or old dark UI, the running `web` container is almost certainly still using the official image. Check it from the `docker` directory:

```bash
docker compose ps -a
```

The `web` service should show:

```text
docker-web-1   dify-mo-web:latest
```

If it shows `langgenius/dify-web:1.15.0`, rebuild and recreate only the frontend and gateway first:

```bash
docker compose rm -sf web nginx
docker compose up -d --build --force-recreate web nginx
```

For a full restart with the customized frontend image:

```bash
docker compose up -d --build --force-recreate
```

## Low-Memory Docker Build Path

On Docker Desktop or WSL environments with limited memory, the source Docker build can fail during `next build` with errors such as `cannot allocate memory` or a BuildKit `EOF`. In that case, build the frontend on the host first, then let Docker only package the generated artifacts.

Run from the repository root:

```bash
pnpm -C web build
pnpm -C web build:vinext
```

Then run from the `docker` directory:

```bash
docker compose -f docker-compose.yaml -f docker-compose.prebuilt-web.yaml up -d --build --force-recreate
```

The prebuilt path still produces and runs the same custom image tag:

```text
dify-mo-web:latest
```

It is the recommended path when the host can build the web app successfully but Docker does not have enough memory to compile the frontend inside the image build.

The default registry proxy variables are:

```env
DOCKER_HUB_PROXY=docker.m.daocloud.io
GHCR_PROXY=ghcr.m.daocloud.io
QUAY_PROXY=quay.m.daocloud.io
ELASTIC_PROXY=elastic.m.daocloud.io
```

If you use a private registry or cloud ACR, put your own proxy values in `docker/.env`.

If you want to run the official Dify images without the customized web build, use the mirror-only override instead:

```bash
docker compose -f docker-compose.yaml -f docker-compose.cn.yaml up -d
```

The customized web Docker build also uses domestic defaults:

```env
DOCKER_PROXY=docker.m.daocloud.io
ALPINE_MIRROR=https://mirrors.aliyun.com/alpine
NPM_REGISTRY=https://registry.npmmirror.com
PIP_MIRROR_URL=https://pypi.tuna.tsinghua.edu.cn/simple
```

The default custom web image tag is `dify-mo-web:latest`. To use a private registry image instead, set this in `docker/.env`:

```env
CUSTOM_WEB_IMAGE=your-registry.example.com/your-namespace/dify-mo-web:latest
```

Then build and push the image from the repository root:

```bash
docker build -f web/Dockerfile -t your-registry.example.com/your-namespace/dify-mo-web:latest .
docker push your-registry.example.com/your-namespace/dify-mo-web:latest
```

For low-memory Docker hosts, build and push the prebuilt runtime image instead:

```bash
pnpm -C web build
pnpm -C web build:vinext
docker build -f web/Dockerfile.prebuilt -t your-registry.example.com/your-namespace/dify-mo-web:latest .
docker push your-registry.example.com/your-namespace/dify-mo-web:latest
```

When using domestic registry mirrors and the low-memory path together, include both optional overrides:

```bash
docker compose -f docker-compose.yaml -f docker-compose.custom.yaml -f docker-compose.prebuilt-web.yaml up -d --build --force-recreate
```

## Future Branding Hook

When the final logo is ready, replace:

- `web/public/logo/logo.svg`
- `web/public/logo/logo-monochrome-white.svg`
- optional PWA icon PNG files under `web/public/icon-*.png`

For more extensive visual changes, keep new token overrides in `web/app/styles/custom-brand.css` rather than editing generated theme files under `packages/dify-ui/src/themes/`.
