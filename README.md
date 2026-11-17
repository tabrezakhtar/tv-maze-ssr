# Field Notes: Nature on TV

Field Notes is a server-rendered catalog of nature and wildlife television shows. It uses the TVMaze API to list shows matching "nature" and provides a detail page for each show.

## Pages

- `/` displays the nature-show catalog with posters and basic show information.
- `/shows/:showId` displays a show's overview, rating, seasons, and cast.

Show data is loaded by React Router route loaders from TVMaze. With server-side rendering enabled, those API requests run on the server.

## JavaScript and Navigation

The app works with JavaScript enabled or disabled. With JavaScript enabled, navigation between the catalog and show pages is handled client-side, so only the relevant page data and content update without a full document reload. With JavaScript disabled, links perform a full page refresh and the server renders each requested page.

To test either mode in Chrome:

1. Open Chrome DevTools with `Ctrl+Shift+I` (on macOS, `Cmd+Option+I`).
2. Open the DevTools Command Menu with `Ctrl+Shift+P` (on macOS, `Cmd+Shift+P`).
3. Search for and select **Disable JavaScript** or **Enable JavaScript**, depending on the current setting.
4. Refresh the page, then navigate between the catalog and a show page to compare the behavior.

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
