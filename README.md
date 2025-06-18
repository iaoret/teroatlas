# Tero Atlas

This prototype was developed with using a Typescript + React + Tauri stack. It features an off the shelf backend with a PostGIS database, a PostgREST API for handling data requests and a pg_tileserv for handling vector tiles.

The overall structure of the app follows this pattern, using the ports as configured on the `docker-compose.yml` file:

![Tero Atlas Structure](./scheme.png)

You can either run the frontend as a web app through `localhost:3000` or install the Tauri desktop app and run it from there. The artifacts are built by the Github Actions CI pipeline and can be downloaded from the [Releases](https://github.com/paschendale/tero-atlas/releases) page for your operating system. Either way, you will need to run the backend first, which can be done by running `docker-compose up` in the root directory or by following the instructions below.

## Running the app

### Installing Docker

To run the app you will need to have Docker and Docker Compose installed. The easiest way to do it is by installing Docker Desktop for Windows or Mac, or by installing Docker on Linux.

- Install Docker Desktop for Windows or Mac following the instructions on the [Docker website](https://www.docker.com/products/docker-desktop/).
- Install Docker on Linux following the instructions on the [Docker website](https://docs.docker.com/engine/install/ubuntu/).

### Downloading the database image

Tero Atlas uses a PostGIS database with pre-built queries to showcase the use of the system. The database can be downloaded on this link: [Tero Atlas Database](https://teroai.s3.us-east-2.amazonaws.com/20250610_q7_tai).

After downloaded, you will need to store the `.backup` file in the `db_image` folder of the Tero Atlas repository. You can do this by dragging the file into the folder or by running the following command in the root directory:

```bash
cp <path-to-backup-file> ./latest.backup
```

### Running the app

To run the app, you will need to run the following commands in the root directory:

```bash
docker-compose up
```

This will start the database, the vector tile server, the PostgREST API and the frontend.

It will take a few minutes for the database to be ready, so you might need to wait a bit before opening the frontend. When the restoring process has finished, you will see the following message on your console:

> Backup successfully restored on teroatlas!"

Don't worry about errors such as these:

> ERROR:  materialized view "q4_nyc_boro_block_economic_data" has not been populated
> HINT:  Use the REFRESH MATERIALIZED VIEW command.
> STATEMENT:  SELECT 1 FROM q4_nyc_boro_block_economic_data LIMIT 1 

These are the result of the health checks done while starting the containers. They are not errors, but they are just a reminder that the database is not ready yet.

## Resetting database

If you want to reset the database, you can run the following command in the root directory:

```bash
docker-compose down -v
```

This will stop the database, the vector tile server, the PostgREST API and the frontend.

You will need to delete the `data` folder and the `db_image` folder, which will be recreated by the newest database image.	

After that, you can run the following command to start the database again:

```bash
docker-compose up
```