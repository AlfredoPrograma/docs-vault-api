FROM node:18-alpine

WORKDIR /src

ADD package.json /src

RUN corepack enable
RUN pnpm i

ADD . /src

RUN pnpm run build

CMD pnpm run start
