#!/bin/bash

if [ ! -d "$HOME/.mct1-worlds" ]; then
    echo "Fetching the MCT1 Worlds - this is a one-time operation"
    git clone --depth 1 https://github.com/Magikcraft/mct1-worlds.git "$HOME/.mct1-worlds"
fi

if [ -x "$(command -v docker)" ]; then
    docker run -it -p 25565:25565 \
        --mount source=scriptcraft-cache,target=/server/cache \
        --mount type=bind,src=$(pwd)/node_modules,dst=/server/scriptcraft-plugins \
        --mount type=bind,src=$HOME/.mct1-worlds,dst=/server/worlds \
        magikcraft/scriptcraft
else
    echo "Install docker from www.docker.com"
    # command
fi
