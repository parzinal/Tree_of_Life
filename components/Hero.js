export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-media">
        <img className="hero-img" src="/coconut-grove.png" alt="Coconut grove landscape" />
      </div>
      <div className="hero-text">
        <img className="hero-logo" src="/tree-of-life-logo.png" alt="" aria-hidden="true" />
        <p className="hero-brand-title">Tree of Life</p>
        <h1>From Crisis to Comeback</h1>
        <p>
          Welcome to Lambanog Heritage Tourism. Discover the history, culture and traditions of
          Lambanog in Lipahan, San Juan, Batangas, where trust, community and sustainable tourism
          grow from the same tree.
        </p>
        <a className="btn" href="#tree">Explore the Tree of Life</a>
      </div>
    </section>
  );
}
