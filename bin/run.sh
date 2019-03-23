#!/bin/bash

if [ ! -d "$HOME/.mct1-worlds" ]; then
    echo "Fetching the MCT1 Worlds - this is a one-time operation"
    git clone --depth 1 https://github.com/Magikcraft/mct1-worlds.git "$HOME/.mct1-worlds"
fi

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
    DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
    SOURCE="$(readlink "$SOURCE")"
    [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done

if [ -x "$(command -v docker)" ]; then
    docker run -it -p 25565:25565 \
        --mount source=scriptcraft-cache,target=/server/cache \
        --mount type=bind,src="${DIR}/../node_modules",dst=/server/scriptcraft-plugins \
        --mount type=bind,src=$HOME/.mct1-worlds,dst=/server/worlds \
        magikcraft/scriptcraft
else
    echo "Install docker from www.docker.com"
    # command
fi
