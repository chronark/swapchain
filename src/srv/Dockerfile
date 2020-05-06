FROM node:14 AS build-stage
ARG SERVICE
WORKDIR /swapchain

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json . 

COPY ./src .

RUN npm install
RUN npm run build

FROM node:14-alpine
ARG SERVICE

WORKDIR /swapchain

COPY package.json .
COPY --from=build-stage /swapchain/build/mocks/* ./mocks/
COPY --from=build-stage /swapchain/build/srv/${SERVICE}/* ./service/

ENV NODE_ENV production
RUN npm install

CMD ["node", "./service/index.js"]