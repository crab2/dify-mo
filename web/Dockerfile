# base image
ARG DOCKER_PROXY=docker.m.daocloud.io
FROM ${DOCKER_PROXY}/library/node:22.22.1-alpine AS base
LABEL maintainer="takatost@gmail.com"

ARG ALPINE_MIRROR=https://mirrors.aliyun.com/alpine
ARG NPM_REGISTRY=https://registry.npmmirror.com
ENV npm_config_registry=${NPM_REGISTRY}
ENV pnpm_config_registry=${NPM_REGISTRY}
ENV COREPACK_NPM_REGISTRY=${NPM_REGISTRY}

RUN sed -i "s#https://dl-cdn.alpinelinux.org/alpine#${ALPINE_MIRROR}#g; s#http://dl-cdn.alpinelinux.org/alpine#${ALPINE_MIRROR}#g" /etc/apk/repositories
RUN apk add --no-cache tzdata
RUN npm config set registry ${NPM_REGISTRY}
RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG NEXT_PUBLIC_BASE_PATH=""
ENV NEXT_PUBLIC_BASE_PATH="$NEXT_PUBLIC_BASE_PATH"


# install packages
FROM base AS packages

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY web/package.json /app/web/
COPY e2e/package.json /app/e2e/
COPY sdks/nodejs-client/package.json /app/sdks/nodejs-client/
COPY packages /app/packages

# Use packageManager from package.json
RUN corepack install

# Install workspace dependencies for the Docker build environment.
RUN VITE_GIT_HOOKS=0 pnpm install --frozen-lockfile

# build resources
FROM base AS builder
WORKDIR /app
COPY --from=packages /app/ .
COPY . .

RUN corepack prepare pnpm@11.9.0 --activate

WORKDIR /app/web
ARG NODE_BUILD_MAX_OLD_SPACE_SIZE=4096
ARG NEXT_BUILD_CPUS=1
ENV NODE_OPTIONS="--max-old-space-size=${NODE_BUILD_MAX_OLD_SPACE_SIZE}"
ENV NEXT_BUILD_CPUS=${NEXT_BUILD_CPUS}
ENV NEXT_TELEMETRY_DISABLED=1
ENV pnpm_config_verify_deps_before_run=false
RUN node -e "require.resolve('@base-ui/react/alert-dialog'); require.resolve('jotai')"
RUN pnpm --config.verify-deps-before-run=false exec next build --webpack
RUN pnpm --config.verify-deps-before-run=false build:vinext


# production stage
FROM base AS production

ENV NODE_ENV=production
ENV EDITION=SELF_HOSTED
ENV DEPLOY_ENV=PRODUCTION
ENV CONSOLE_API_URL=http://127.0.0.1:5001
ENV APP_API_URL=http://127.0.0.1:5001
ENV MARKETPLACE_API_URL=https://marketplace.dify.ai
ENV MARKETPLACE_URL=https://marketplace.dify.ai
ENV PORT=3000
ENV EXPERIMENTAL_ENABLE_VINEXT=false
ENV NEXT_TELEMETRY_DISABLED=1

# set timezone
ENV TZ=UTC
RUN ln -s /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone

# Create non-root user
ARG dify_uid=1001
RUN addgroup -S -g ${dify_uid} dify && \
    adduser -S -u ${dify_uid} -G dify -s /bin/ash -h /home/dify dify && \
    mkdir /app && \
    chown -R dify:dify /app


WORKDIR /app

COPY --from=builder --chown=dify:dify /app/web/public ./targets/next/web/public
COPY --from=builder --chown=dify:dify /app/web/.next/standalone ./targets/next/
COPY --from=builder --chown=dify:dify /app/web/.next/static ./targets/next/web/.next/static
COPY --from=builder --chown=dify:dify /app/web/dist/standalone ./targets/vinext

COPY --chown=dify:dify --chmod=755 web/docker/entrypoint.sh ./entrypoint.sh

RUN if [ -d /app/targets/next/web/.next/node_modules ]; then \
      find /app/targets/next/web/.next/node_modules -maxdepth 1 -type l -print | while read -r link; do \
        target="$(readlink "$link")"; \
        package="${target##*/node_modules/}"; \
        replacement="$(find /app/targets/next/node_modules/.pnpm -path "*/node_modules/${package}" -type d | head -n 1)"; \
        if [ -n "$replacement" ]; then \
          rm "$link"; \
          cp -a "$replacement" "$link"; \
          chown -R dify:dify "$link"; \
        fi; \
      done; \
    fi

ARG COMMIT_SHA
ENV COMMIT_SHA=${COMMIT_SHA}

USER dify
EXPOSE 3000
ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
