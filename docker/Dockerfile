FROM registry.ucchip.com/common/npm:node-10-alpine
MAINTAINER liaoxing <13330955821@163.com>
WORKDIR /app
ADD . .
RUN cnpm install
RUN cnpm run build:prod
WORKDIR /app/dist
ENTRYPOINT ["http-server","-c-1","-p 8013"]
EXPOSE 8013