#!/usr/bin/env bash

KIBANA_YML=`realpath ../configs/kibana.yml`
IP="192.168.0.106"

#docker run -p 8090:80 -e "elasticsearch.url=http://${IP}:9200" -v ${KIBANA_YML}:/usr/share/kibana/config/kibana.yml docker.elastic.co/kibana/kibana:5.4.3
docker run -p 5601:5601 -e "elasticsearch.url=http://${IP}:9200" -e "xpack.security.enabled=false" -v ${KIBANA_YML}:/usr/share/kibana/config/kibana.yml docker.elastic.co/kibana/kibana:5.4.3

