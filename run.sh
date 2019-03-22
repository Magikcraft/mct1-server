#!/bin/bash
docker run -it -p 25565:25565 \
    --mount source=scriptcraft-cache,target=/server/cache \
    --mount type=bind,src=$(pwd)/node_modules,dst=/server/scriptcraft-plugins \
    magikcraft/scriptcraft

#--mount type=bind,src=$(pwd)/mct1-worlds,dst=/server/worlds \
