FROM node:14 AS build-stage

ARG SERVICE_NAME


WORKDIR /app


COPY package.json .
COPY package-lock.json .
COPY tsconfig.json . 

COPY ./src/srv/${SERVICE_NAME} ./src/srv/
COPY ./src/mocks ./src/
RUN npm install

RUN npm run build



FROM node:14-alpine
ARG SERVICE_NAME


WORKDIR /app

COPY package.json .
COPY --from=build-stage /app/build/${SERVICE_NAME} . 


ENV NODE_ENV production
RUN npm install

CMD ["node", "index.js"]