ARG BASE_IMAGE

FROM ${BASE_IMAGE} AS base

FROM node:14 AS service
WORKDIR /swapchain

COPY --from=base /swapchain/node_modules ./node_modules/
COPY --from=base /swapchain/dist/pkg ./pkg/
COPY --from=base /swapchain/dist/srv/bcoin ./srv/service/
COPY package.json .

ENV NODE_ENV production
RUN npm install

CMD ["node", "./srv/service/index.js"]