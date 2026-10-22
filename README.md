# Field Notes: Nature on TV

Field Notes is a server-rendered catalog of nature and wildlife television shows. It uses the TVMaze API to list shows matching "nature" and provides a detail page for each show.

## Pages

- `/` displays the nature-show catalog with posters and basic show information.
- `/shows/:showId` displays a show's overview, rating, seasons, and cast.

Show data is loaded by React Router route loaders from TVMaze. With server-side rendering enabled, those API requests run on the server.

## Stack

- React Router Framework Mode with TypeScript and SSR
- Tailwind CSS 4
- TVMaze API
- Netlify React Router Vite plugin for Netlify SSR deployment

## Local Development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

The app is available at `http://localhost:5173`.

Create a production build:

```sh
npm run build
```

## Deploy to Netlify

The repository includes `netlify.toml` with the build command and publish directory, and the Vite config includes Netlify's React Router adapter. Connect the repository to Netlify and deploy; the adapter runs the SSR app using Netlify Functions. Node.js `22.22.0` is configured in `netlify.toml` to meet the React Router engine requirement.

## TVMaze API

- Search: `https://api.tvmaze.com/search/shows?q=nature`
- Show details: `https://api.tvmaze.com/shows/{id}?embed[]=cast&embed[]=seasons`
