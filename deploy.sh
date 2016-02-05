#!/bin/bash
# This script will deploy this app to the server

echo "Build the ember app"
ember build

echo
echo "Compress that shit"
tar -zcvf www.cloudamp.io.tar.gz dist/

echo
echo "Pushing that mother fucker to the only server we have... why not use scp"
scp -i ~/.ssh/cloudamp.pem www.cloudamp.io.tar.gz ec2-user@cloudamp.io:
