FROM node:lts-alpine AS builder

LABEL maintainer="alastair@play-consult.co.uk"

COPY . /app

WORKDIR /app

RUN yarn install
RUN rm -f .npmrc

WORKDIR /app/client

RUN yarn install
RUN yarn run build

FROM node:lts-alpine

COPY --from=builder /app /app

WORKDIR /app
ENV PORT 3000
EXPOSE 3000

ENTRYPOINT ["/app/bin/www"]
