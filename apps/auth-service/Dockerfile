FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY apps/auth-service/package.json ./apps/auth-service/

RUN pnpm install --frozen-lockfile

COPY packages/tsconfig ./packages/tsconfig

COPY apps/auth-service ./apps/auth-service

WORKDIR /repo/apps/auth-service
EXPOSE 4001

CMD ["pnpm", "dev"]
