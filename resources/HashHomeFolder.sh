#!/bin/bash

cd ..
pwd

nvm use 8

rm -rf /Users/mgrill/Sandbox/workspace-test.sqllite

node index.js IndexPath -i /Users/mgrill/Workspace -d /Users/mgrill/Sandbox/workspace-test.sqllite
node index.js HashDupeSizes -i /Users/mgrill/Workspace -d /Users/mgrill/Sandbox/workspace-test.sqllite