## Google contact server

### Requirements

- Nodejs (v12.13.1 recommended)
- Mongodb (v4.0.12 recommended)
- Docker (19.03.8 recommended)

#### Configuration


### Setup

- sudo service mongod start ( if mongo is not running)
- cd g_contacts_server
- npm install
- npm start
- use npm start-dev for development server (requires nodemon)


## Docker setup

- docker-compose build
- docker-compose up
- The server will run on port 8080