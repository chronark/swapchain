FROM node:14 AS build-stage
WORKDIR /swapchain


COPY package.json package-lock.json tsconfig.json tsconfig.prod.json ./

COPY ./srv .
COPY ./pkg .

RUN npm install
RUN npm run build

RUN ls -al ./dist

FROM node:14
ARG SERVICE
WORKDIR /swapchain

# RUN apt-get update && apt-get install -y --no-install-recommends git && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

COPY package.json .
COPY --from=build-stage /swapchain/dist/${SERVICE}/* ./service/

ENV NODE_ENV production
RUN npm install

CMD ["node", "./service/index.js"]