FROM node:14 AS build-stage

ARG SERVICE_NAME


WORKDIR /swapchain


COPY package.json .
COPY package-lock.json .
COPY tsconfig.json . 

COPY ./src/srv/${SERVICE_NAME} ./src/srv/
COPY ./src/mocks/* ./src/mocks/

RUN npm install

RUN npm run build

FROM node:14-alpine
ARG SERVICE_NAME


WORKDIR /swapchain/${SERVICE_NAME}

COPY package.json .
COPY --from=build-stage /swapchain/build/${SERVICE_NAME} . 

ENV NODE_ENV production
RUN npm install

CMD ["node", "index.js"]