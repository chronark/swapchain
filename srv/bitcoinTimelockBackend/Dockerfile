FROM node:14 AS compile

WORKDIR /swapchain

COPY . .
RUN rm -rf ./srv/web
RUN npm install

RUN npm run build

FROM node:14-alpine3.10

WORKDIR /swapchain

COPY package.json .
COPY --from=compile /swapchain/dist/srv/bitcoinTimelockBackend ./srv/bitcoinTimelockBackend/
RUN npm install --only=production


CMD ["node", "./srv/bitcoinTimelockBackend/index.js"]