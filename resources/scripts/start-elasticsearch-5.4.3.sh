#!/usr/bin/env bash

YML_PATH=`realpath ../configs/elasticsearch-dev.yml`

docker run \
    -p 9200:9200 \
    -e "http.host=0.0.0.0" \
    -e "transport.host=127.0.0.1" \
    -e "xpack.security.enabled=false" \
    -v ${YML_PATH}:/usr/share/elasticsearch/config/elasticsearch.yml \
    docker.elastic.co/elasticsearch/elasticsearch:5.4.3