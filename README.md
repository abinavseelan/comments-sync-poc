# Real-time Text Sync - PoC

A PoC to demo real-time diff based text syncing.

## Features

- Syncs text-diffs with server in *real-time*
- Syncing is debounced on the client to prevent too many calls. Text is synced when the user has paused typing (500 ms)
- Text are stored as drafts. An assumption that is made is that a draft is *unique* for a given user & a given post.
- Drafts can be loaded on any device to continue work from there. All that is required is the user ID and post ID to fetch the draft for the post.
- Saving a text post will purge the draft.

## Setup Guide

### Requirements

You will need:
- MongoDB installed on your machine.
- NodeJS v8.x

### Setting up MongoDB

We require a persistent data store to save our `Drafts` and `Comments`. To do this, we need to run the Mongo Daemon so that our NodeJS server can connect to it.

To run the mongo daemon, run the command `mongod`. We can also pass a `-dbpath` flag to specify the directory we want the data to be stored in. 

For containment purposes, for this project, create a directory called `data` in the project root and a directory called `db` within in (just to follow the naming convention :slightly_smiling_face:)

Then run

```
$ mongod --dbpath ./data/db
```

### Setting up the Server

In **another terminal**, run `yarn`, or if you don't have Yarn, run `npm install`. However, I would recommend [Yarn](https://yarnpkg.com/en/) since it is a lot faster to install packages. 🙂 

Once all the dependencies are installed, run

```
$ yarn run server
 
or 

$ npm run server
```

This will fire up the server. 

### Building the bundles for the front end

This project uses React for the views and uses Webpack to bundle all the assets together. Before we can get to rendering the UI, we need to run webpack to bundle all our assets together.

To bundle all the assets for development (which would include a *lot* of debugging tools for React), run

```
$ yarn run build

or 

$ npm run build
```

All the assets will be bundled into `client/build`. This is the directory that will be served by our server.


And that's it! 
You can visit `localhost:1337` to view the project. :smile: :rocket:
