FROM node:22 AS base

FROM base AS dependencies

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm i

FROM dependencies AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

RUN npm run build
RUN npm prune --prod

FROM node:22 AS deploy

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]
