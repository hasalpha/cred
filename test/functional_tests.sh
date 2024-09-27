#!/bin/bash
# RUN Firefox test
# Step 1: Run the containers
# Pull the selenium/standalone-firefox Docker image
docker pull selenium/standalone-firefox
# # Stop and remove any existing Selenium containers
# docker stop selenium-standalone-firefox \
# docker rm selenium-standalone-firefox \

docker run -d --name selenium-standalone-firefox -p 4444:4444 selenium/standalone-firefox
WORKDIR /test 
COPY test /test
RUN npm install
#Run registration function test case
docker exec -it selenium-standalone-firefox node sequence.cjs $ENVIRONMENT

RUN sleep 5 && sleep 5 && sleep 5 && sleep 5 && sleep 5 && sleep 5
#Run Login function test case
docker exec -it selenium-standalone-firefox node credible-ft.cjs $ENVIRONMENT

# Stop and remove the container
docker stop selenium-standalone-firefox
docker rm selenium-standalone-firefox