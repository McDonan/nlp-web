FROM docker.artifactory.kasikornbank.com:8443/node:12-buster-slim AS builder
WORKDIR /app
COPY .npmrc /app/.npmrc
COPY package.json /app/package.json
RUN npm install --verbose

COPY tsconfig.json /app/tsconfig.json
COPY .eslintrc.json /app/.eslintrc.json
COPY .prettierrc.js /app/.prettierrc.js

COPY public /app/public
COPY src /app/src

RUN npm run build

FROM docker.artifactory.kasikornbank.com:8443/node:12-buster-slim
WORKDIR /app
COPY --from=builder /app/build /app/build
RUN npm install -g serve@12.0.0

RUN rm -rf /usr/bin/wget
EXPOSE 3000
CMD ["serve","-s","build","-l", "3000","-c", "serve.json"]



