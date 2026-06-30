# Custom UI Deployment

This fork keeps the official Dify project structure and layers the UI changes on top of the existing frontend design system.

## What Changed

- `web/app/styles/custom-brand.css` overrides Dify semantic tokens with an Ant Design aligned palette:
  - primary action color: `#1677FF`
  - hover/action color: `#4096FF`
  - active color: `#0958D9`
  - neutral page and panel backgrounds for dense enterprise workflows
  - success, warning, and error colors aligned to common Ant Design status colors
- `web/app/components/main-nav/layout.tsx`, `web/app/components/main-nav/index.tsx`, `web/app/components/header/header-wrapper.tsx`, and `web/app/account/(commonLayout)/layout.tsx` add brand layout styling without changing business logic.
- `web/public/logo/logo.svg` and `web/public/logo/logo-monochrome-white.svg` are temporary `MO AI` placeholder logos.
- `web/app/layout.tsx`, `web/public/manifest.json`, and `web/public/browserconfig.xml` update browser theme metadata to the customized blue.
- `docker/docker-compose.custom.yaml` lets Docker Compose build the customized frontend image from this source tree.

## Local Docker Compose Deployment

Run from the `docker` directory:

```bash
cp .env.example .env
docker compose -f docker-compose.yaml -f docker-compose.custom.yaml up -d --build
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

The standard generated `docker/docker-compose.yaml` is intentionally left untouched, so future upstream Dify compose regeneration stays clean.

## Future Branding Hook

When the final logo is ready, replace:

- `web/public/logo/logo.svg`
- `web/public/logo/logo-monochrome-white.svg`
- optional PWA icon PNG files under `web/public/icon-*.png`

For more extensive visual changes, keep new token overrides in `web/app/styles/custom-brand.css` rather than editing generated theme files under `packages/dify-ui/src/themes/`.
