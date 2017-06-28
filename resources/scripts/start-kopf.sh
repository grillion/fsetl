#!/usr/bin/env bash

docker run -d -p 8091:80 -e KOPF_SERVER_NAME=grafana.dev \
    -e KOPF_ES_SERVERS=192.168.0.106:9200 \
    -e KOPF_BASIC_AUTH_LOGIN=elastic \
    -e KOPF_BASIC_AUTH_PASSWORD=a0fm2pri1 \
    --name kopf lmenezes/elasticsearch-kopf