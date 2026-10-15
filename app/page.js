import Header from "../components/Header";
import Hero from "../components/Hero";
import TreeOfLife from "../components/TreeOfLife";
import Link from "next/link";
import Footer from "../components/Footer";

const FEATURED_TOPICS = [
  { slug: "heritage", icon: "🌿", title: "Our Heritage", description: "Discover the traditions, identity and coconut-growing knowledge behind Lambanog." },
  { slug: "how-it-is-made", icon: "🥥", title: "How It Is Made", description: "Follow the traditional journey from coconut sap to a finished spirit." },
  { slug: "the-crisis", icon: "📖", title: "The Crisis", description: "Understand the 2019 public-health crisis and its impact on consumer confidence." },
  { slug: "trust-and-safety", icon: "✓", title: "Trust & Safety", description: "Find responsible guidance and learn why product-specific verification matters." },
  { slug: "digital-stories", icon: "✦", title: "Community Stories", description: "Explore how community voices and shared memories can help preserve heritage." },
  { slug: "tourism", icon: "🌱", title: "Tourism Experiences", description: "Learn about responsible, community-centered Lambanog heritage tourism." },
];

const OBJECTIVES = [
  ["Restore public trust", "Share accurate, transparent information and responsible safety guidance."],
  ["Promote cultural heritage", "Recognize the traditions and knowledge that shape Lambanog heritage."],
  ["Increase heritage awareness", "Help visitors understand the people and practices behind the story."],
  ["Encourage responsible tourism", "Support respectful visits and sustainable community participation."],
];

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TreeOfLife />
        <section className="home-content">
          <div className="section-heading">
            <p className="eyebrow">Explore the story</p>
            <h2>From Crisis to Comeback</h2>
            <p>Explore Lambanog heritage through its traditions, production, lessons in trust, community voices and responsible tourism.</p>
          </div>
          <div className="home-grid">
            {FEATURED_TOPICS.map(({ slug, icon, title, description }) => (
              <Link className="home-card" href={`/${slug}`} key={slug}>
                <span className="home-card-icon" aria-hidden="true">{icon}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <strong>Explore topic <span aria-hidden="true">→</span></strong>
              </Link>
            ))}
          </div>
          <div className="objectives">
            <div className="objectives-heading">
              <p className="eyebrow">Our purpose</p>
              <h2>Heritage grows when the story is shared with care.</h2>
              <p>Our project connects cultural learning with clear, responsible information and community-centered tourism.</p>
            </div>
            <ul>{OBJECTIVES.map(([title, description]) => <li key={title}><strong>{title}</strong><span>{description}</span></li>)}</ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
