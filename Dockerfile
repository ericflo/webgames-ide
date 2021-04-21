# STAGE 1

FROM node:latest

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
ENV NEXT_PUBLIC_IS_PROD=t
ENV NEXT_PUBLIC_IS_HANDSHAKE=f
RUN npm run build

# STAGE 2

FROM golang:latest

RUN go get -u github.com/NebulousLabs/skynet-cli/...
COPY --from=0 --chown=nginx /usr/src/app/out/ /usr/src/app/
CMD [ "bash", "-c", "/go/bin/skynet upload /usr/src/app/" ]