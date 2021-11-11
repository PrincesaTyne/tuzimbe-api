# Tuzimbe-api

Tuzimbe-api is an api that can be used by construction sites to keep track of workers and building material at their
construction sites.

## Installation and Setup Instructions

First, you will need `node` installed globally on your machine and also `postgres` set up.

Follow the steps below to install postgres and creating a database that we'll be using in the project.

1. Installation

    If you’re using Windows, download a Windows installer of PostgreSQL.

    If you’re using a Mac, you can use Homebrew  for the installation.Open up the Terminal and install postgresql with brew.

    ```bash
    brew install postgresql
    # or
    brew install postgres
    ```

    Start postgres using this command

    ```bash
    brew services start postgresql
    ```

    If you're using Linux, first refresh your server’s local package index

    ```bash
    sudo apt update
    ```
    Then, install the Postgres package along with a `-contrib` package that adds some additional utilities and functionality

    ```bash
    sudo apt install postgresql postgresql-contrib
    ```

2. PostgreSQL command prompt
    `psql` is the PostgreSQL interactive terminal. Running psql will connect you to a PostgreSQL host. Running psql --help will give you more information about the available options for connecting with psql.

    --h   --host=HOSTNAME | database server host or socket directory (default: “local socket”)

    --p   --port=PORT | database server port (default: “5432”)

    --U   --username=USERNAME | database username (default: “your_username”)

    --w   --no-password | never prompt for password

    --W   --password | force password prompt (should happen automatically)
    We’ll just connect to the default postgres database with the default login information – no option flags.

    ```bash
    psql postgres
    ```

    You’ll see that we’ve entered into a new connection. We’re now inside psql in the postgres database. The prompt ends with a # to denote that we’re logged in as the superuser, or root.

    ```bash
    postgres=#
    ```

    Commands within psql start with a backslash (\). To test our first command, we can ensure what database, user, and port we’ve connected to by using the \conninfo command.

    ```bash
    postgres=# \conninfo
    ```

    You are connected to database `"postgres"` as user `"your_username"` via socket in "/tmp" at port "5432".
    Here is a reference table of a few common commands which we’ll be using in this tutorial.

    \q | Exit psql connection

    \c | Connect to a new database

    \dt | List all tables

    \du | List all roles

    \list | List databases

    Let’s create a new database and user so we’re not using the default accounts, which have superuser privileges.

3. Creating a role in Postgres
    First, we’ll create a role called `your-role` and give it a password of `your-password`. A role can function as a user or a group, so in this case, we’ll be using it as a user.

    ```bash
    postgres=# CREATE ROLE 'your-role' WITH LOGIN PASSWORD 'your-password';
    ```

    We want `your-role to be able to create a database.

    ```bash
    postgres=# ALTER ROLE your-role CREATEDB;
    ```

    You can run `\du` to list all roles/users. You can exit out of this terminal by `\q`

    Connect postgres with `your-role`

    ```bash
    psql -d postgres -U 'your-role'
    ```

    Instead of `postgres=#`, our prompt shows `postgres=>` now, meaning we’re no longer logged in as a superuser.

3. Creating a database in Postgres

    Create a database with the SQL command.

    ```bash
    postgres=> CREATE DATABASE 'your-database';
    ```
    Use the `\list` command to see the available databases and `/c` to connect to your database

    ```bash
    postgres=> \c 'your-database'
    ```
    You are now connected to database "your-database" as user "your-role".

    api=>

    Our prompt now displays that we’re connected to `your-database`.

Note that the above credentials will be used in our project. In the root folder you can find  the file `.env.example` which contains environment variables required for the project.

Next run the project on your machine. In terminal,

1. Clone down this repository.

   ```bash
   git clone https://github.com/PrincesaTyne/tuzimbe-api
   ```

2. Change directory to the newly created project folder

   ```bash
   cd tuzimbe-api
   ```

3. Run the server

   ```bash
   node server.js
   # or
   npm start
   ```

   This will start the server but everytime you make a change you'll have to stop and restart the server. So you can use the `nodemon` package to run the server as it automatically restarts the server whenever it detects a change.

   ```bash
   nodemon server.js
   # or
   nodemon ./server.js
   ```

5. Open [http://localhost:3030](http://localhost:3030) in the browser or `postman` to test your endpoints.


Make sure to checkout a [sample frontend](https://github.com/PrincesaTyne/tuzimbe) for this api



# Code Overview

## Dependencies

- [express](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [pg](https://github.com/brianc/node-postgres) - PostgreSQL client

## Application Structure

- `server.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `controllers/` - This folder contains functions that directly responds to each HTTP Request that comes into our application.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our postgres models.
