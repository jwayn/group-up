# groupup

An app for syncing everyone up. Try it out at https://groupup.quest

## Considerations

This application does not store any user state. Beyond a simple event title, all interactions and data are completely anonymous. A list of created events and voted-for events are stored in the browser with the local storage API. Deleting an event _does not_ delete it from the server and/or database, but instead merely removes the reference stored in the browser.

## Development

### Starting the Database

**Dependencies**: none

#### Steps

1. `npx prisma migrate dev` from root dir
2. `docker-compose up` from root dir

### Starting the Server

**Dependencies**: Database

#### Steps

1. `npm install` from root dir
2. `npm run dev` from root dir

### Starting the Client

**Dependencies**: Server, Database

#### Steps

1. `npm install` from `/src/frontend`
2. `npm start` from `/src/frontend`
