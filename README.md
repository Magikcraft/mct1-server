# MCT1 Server

Run a [Minecraft for Type 1 Diabetes](https://www.mct1.io) Server on your local machine.

## Prerequisites

-   [Docker](https://www.docker.com/)
-   [Node](https://nodejs.org/en/)
-   [Minecraft Java Edition](https://minecraft.net)

## Install

```bash
npm i -g mct1-server
```

## Run

Use the `mct1-server` command to start and stop the server.

```bash
➜ mct1-server

MCT1 Server - by Magikcraft.io
Version 0.0.11

Usage:
mct1-server <command>

Available commands:
start 	 Start the MCT1 server
stop 	 Stop the MCT1 server
status 	 Get the status of the MCT1 server
```

Start the server:

```bash
mct1-server start
```

Now you can connect your Minecraft client to `localhost`.

Stop the server:

```bash
mct1-server stop
```

Get the server status:

```bash
mct1-server status
```
