FROM node:22-alpine as build

LABEL title="ifcloud-front"
LABEL version="0.1.0"
LABEL maintainer="ifelfi"

RUN apk add --no-cache g++ make py3-pip

WORKDIR /app
COPY . ./
RUN npm install -y && \
  npm run build && \
  npm prune --production

FROM node:22-alpine as deploy

WORKDIR /app
RUN rm -rf ./* && \
  npm i -g serve
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.env ./.env

ENTRYPOINT ["serve", "-s", "dist", "-l", "5173"]