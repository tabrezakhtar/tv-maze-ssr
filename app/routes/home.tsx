import type { Route } from "./+types/home";

type Show = {
  id: number;
  name: string;
  summary: string | null;
  image: { medium: string; original: string } | null;
  genres: string[];
  premiered: string | null;
  rating: { average: number | null };
  network: { name: string } | null;
  webChannel: { name: string } | null;
};

type SearchResult = { show: Show };

export async function loader() {
  try {
    const response = await fetch("https://api.tvmaze.com/search/shows?q=nature");
    if (!response.ok) throw new Error("TVMaze request failed");
    const results = (await response.json()) as SearchResult[];
    return { shows: results.map(({ show }) => show), error: null };
  } catch {
    return { shows: [] as Show[], error: "Shows could not be loaded. Please try again later." };
  }
}

export function meta() {
  return [
    { title: "Nature on TV | Field Notes" },
    { name: "description", content: "Explore nature documentaries and wildlife series." },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { shows, error } = loaderData;

  return (
    <main className="catalog-page">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Field Notes home">
          <span className="wordmark-mark" aria-hidden="true">F</span>
          <span>FIELD NOTES<span className="wordmark-dot">.</span></span>
        </a>
        <span className="header-caption">A guide to the wild on screen</span>
      </header>

      <section className="catalog-intro">
        <p className="eyebrow">THE NATURE COLLECTION <span> / TV MAZE</span></p>
        <h1>Wild worlds.<br /><em>Remarkable stories.</em></h1>
        <p className="intro-copy">Find your next journey into the natural world.</p>
      </section>

      <section className="show-section" aria-labelledby="shows-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CURATED FOR THE CURIOUS</p>
            <h2 id="shows-heading">Nature shows</h2>
          </div>
          <span className="result-count">{shows.length} SERIES</span>
        </div>

        {error ? (
          <p className="notice" role="status">{error}</p>
        ) : shows.length === 0 ? (
          <p className="notice">No shows found.</p>
        ) : (
          <div className="show-grid">
            {shows.map((show, index) => (
              <a className="show-card" href={`/shows/${show.id}`} key={show.id}>
                <div className="poster-wrap">
                  {show.image ? (
                    <img src={show.image.medium} alt={`${show.name} poster`} loading="lazy" />
                  ) : (
                    <div className="poster-placeholder" aria-label="No poster available">FN</div>
                  )}
                  <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </div>
                <div className="show-card-info">
                  <div>
                    <h3>{show.name}</h3>
                    <p>{show.genres.slice(0, 2).join(" · ") || "Documentary"}</p>
                  </div>
                  <span className="show-year">{show.premiered?.slice(0, 4) ?? "—"}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
      <footer className="site-footer"><span>FIELD NOTES</span><span>Stories from the natural world</span></footer>
    </main>
  );
}
