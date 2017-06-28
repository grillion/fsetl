#!/usr/bin/env bash


curl -XPUT -u elastic 'localhost:9200/_xpack/security/user/elastic/_password' -H "Content-Type: application/json" -d '{
  "password" : "a0fm2pri1"
}'

curl -XPUT -u elastic 'localhost:9200/_xpack/security/user/kibana/_password' -H "Content-Type: application/json" -d '{
  "password" : "a0fm2pri1"
}'

curl -XPUT -u elastic 'localhost:9200/_xpack/security/user/logstash_system/_password' -H "Content-Type: application/json" -d '{
  "password" : "a0fm2pri1"
}'