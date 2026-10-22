import type { Route } from "./+types/show-details";
import { isRouteErrorResponse } from "react-router";

type Person = {
  id: number;
  name: string;
  image: { medium: string } | null;
};

type CastMember = { person: Person; character: { name: string } };

type Season = {
  id: number;
  number: number;
  premiereDate: string | null;
  endDate: string | null;
  episodeOrder: number | null;
};

type Show = {
  id: number;
  name: string;
  summary: string | null;
  image: { original: string; medium: string } | null;
  genres: string[];
  premiered: string | null;
  ended: string | null;
  status: string;
  rating: { average: number | null };
  network: { name: string } | null;
  webChannel: { name: string } | null;
  language: string | null;
  officialSite: string | null;
  _embedded: { cast: CastMember[]; seasons: Season[] };
};

export async function loader({ params }: Route.LoaderArgs) {
  if (!params.showId || !/^\d+$/.test(params.showId)) {
    throw new Response("Show not found", { status: 404 });
  }

  const response = await fetch(
    `https://api.tvmaze.com/shows/${params.showId}?embed[]=cast&embed[]=seasons`,
  );
  if (response.status === 404) throw new Response("Show not found", { status: 404 });
  if (!response.ok) throw new Response("TVMaze is unavailable", { status: 502 });

  return (await response.json()) as Show;
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData ? `${loaderData.name} | Field Notes` : "Show details | Field Notes" },
    { name: "description", content: loaderData?.name ?? "Nature show details" },
  ];
}

export default function ShowDetails({ loaderData: show }: Route.ComponentProps) {
  const broadcaster = show.network?.name ?? show.webChannel?.name;

  return (
    <main className="detail-page">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Field Notes home">
          <span className="wordmark-mark" aria-hidden="true">F</span>
          <span>FIELD NOTES<span className="wordmark-dot">.</span></span>
        </a>
        <a className="back-link" href="/">← <span>All shows</span></a>
      </header>

      <section className="detail-hero">
        <div className="detail-copy">
          <p className="eyebrow">NATURE COLLECTION <span> / {show.status.toUpperCase()}</span></p>
          <h1>{show.name}</h1>
          <div className="detail-tags">
            {show.genres.map((genre) => <span key={genre}>{genre}</span>)}
          </div>
          <div className="detail-facts">
            {show.premiered && <span>{show.premiered.slice(0, 4)}{show.ended ? `–${show.ended.slice(0, 4)}` : ""}</span>}
            {broadcaster && <span>{broadcaster}</span>}
            {show.language && <span>{show.language}</span>}
            {show.rating.average != null && <span className="rating">★ {show.rating.average.toFixed(1)}</span>}
          </div>
          {show.summary ? (
            <div className="show-summary" dangerouslySetInnerHTML={{ __html: show.summary }} />
          ) : (
            <p className="show-summary">No description is available for this series.</p>
          )}
          {show.officialSite && (
            <a className="official-link" href={show.officialSite} target="_blank" rel="noreferrer">
              Visit official site <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
        <div className="detail-poster">
          {show.image ? <img src={show.image.original} alt={`${show.name} poster`} /> : <div className="poster-placeholder">FN</div>}
          <span className="poster-caption">SERIES NO. {String(show.id).padStart(4, "0")}</span>
        </div>
      </section>

      <section className="detail-section" aria-labelledby="seasons-heading">
        <div className="section-heading">
          <div><p className="eyebrow">THE EPISODE GUIDE</p><h2 id="seasons-heading">Seasons</h2></div>
          <span className="result-count">{show._embedded.seasons.length} SEASONS</span>
        </div>
        {show._embedded.seasons.length > 0 ? (
          <ol className="season-list">
            {show._embedded.seasons.map((season) => (
              <li key={season.id}>
                <span className="season-number">{String(season.number).padStart(2, "0")}</span>
                <span className="season-name">Season {season.number}</span>
                <span className="season-dates">
                  {season.premiereDate?.slice(0, 4) ?? "TBA"}
                  {season.endDate ? ` – ${season.endDate.slice(0, 4)}` : ""}
                </span>
                <span className="season-episodes">{season.episodeOrder ? `${season.episodeOrder} episodes` : "Episode count unavailable"}</span>
              </li>
            ))}
          </ol>
        ) : <p className="notice">Season information is not available.</p>}
      </section>

      <section className="detail-section cast-section" aria-labelledby="cast-heading">
        <div className="section-heading">
          <div><p className="eyebrow">THE PEOPLE BEHIND THE STORY</p><h2 id="cast-heading">Cast &amp; crew</h2></div>
          <span className="result-count">{show._embedded.cast.length} PEOPLE</span>
        </div>
        {show._embedded.cast.length > 0 ? (
          <div className="cast-grid">
            {show._embedded.cast.slice(0, 12).map(({ person, character }) => (
              <article className="cast-member" key={`${person.id}-${character.name}`}>
                {person.image ? <img src={person.image.medium} alt="" loading="lazy" /> : <div className="cast-placeholder">{person.name.slice(0, 1)}</div>}
                <div><h3>{person.name}</h3><p>{character.name}</p></div>
              </article>
            ))}
          </div>
        ) : <p className="notice">Cast information is not available.</p>}
      </section>

      <footer className="site-footer"><span>FIELD NOTES</span><a href="/">Back to the collection ↑</a></footer>
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="error-page">
      <a className="wordmark" href="/">
        <span className="wordmark-mark" aria-hidden="true">F</span>
        <span>FIELD NOTES<span className="wordmark-dot">.</span></span>
      </a>
      <p className="eyebrow">{isNotFound ? "SHOW NOT FOUND" : "CONNECTION INTERRUPTED"}</p>
      <h1>{isNotFound ? "We couldn't find that series." : "Show details couldn't be loaded."}</h1>
      <a className="official-link" href="/">← Return to all shows</a>
    </main>
  );
}