ARG NODE_IMAGE=node:lts-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
RUN npm install -g pnpm
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile
COPY --chown=node:node . .

FROM dependencies AS build
RUN pnpm build

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./
RUN pnpm i --prod --frozen-lockfile
COPY --chown=node:node --from=build /home/node/app/build .

COPY --chown=node:node .env ./
EXPOSE ${PORT}
