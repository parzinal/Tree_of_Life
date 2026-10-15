import Link from "next/link";
import Footer from "./Footer";
import { PAGE_CONTENT, PAGE_ORDER } from "../lib/pages";
import HeritageLearningHub from "./HeritageLearningHub";
import CommunityBoard from "./CommunityBoard";
import TourPlanner from "./TourPlanner";

const PAGE_FEATURES = {
  heritage: <HeritageLearningHub mode="heritage" />,
  learning: <HeritageLearningHub mode="learning" />,
  community: <CommunityBoard />,
  tourism: <TourPlanner />,
};

function PageSection({ section }) {
  return (
    <section className="content-block">
      <h2>{section.heading}</h2>
      {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.items && (
        <ul className="detail-list">
          {section.items.map((item) => (
            <li key={typeof item === "string" ? item : item.title}>
              {typeof item === "string" ? item : <><strong>{item.title}</strong><span>{item.detail}</span></>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function BusinessDirectory({ businesses }) {
  return (
    <section className="business-directory" aria-label="Featured Lambanog businesses">
      {businesses.map((business) => (
        <article className="business-card" key={business.name}>
          <figure className={`business-image${business.imageFit === "contain" ? " business-image-contain" : ""}`}>
            <img src={business.image} alt={business.imageAlt} />
            <figcaption>{business.imageCaption}</figcaption>
          </figure>
          <div className="business-copy">
            <p className="eyebrow">{business.location}</p>
            <h2>{business.name}</h2>
            <p>{business.description}</p>
            <p className="business-note">{business.note}</p>
            <a href={business.source.href} target="_blank" rel="noreferrer">{business.source.label} ↗</a>
          </div>
        </article>
      ))}
    </section>
  );
}

export default function ContentPage({ slug }) {
  const page = PAGE_CONTENT[slug];
  const index = PAGE_ORDER.indexOf(slug);
  const previous = index > 0 ? PAGE_ORDER[index - 1] : null;
  const next = index < PAGE_ORDER.length - 1 ? PAGE_ORDER[index + 1] : null;

  return (
    <>
      <main className="content-page">
        <header className="page-hero">
          <p className="eyebrow">Lambanog Heritage Tourism</p>
          <h1>{page.title}</h1>
          <p className="page-intro">{page.intro}</p>
        </header>
        {page.businesses ? (
          <BusinessDirectory businesses={page.businesses} />
        ) : (
          <figure className="content-image">
            <img
              src={page.bannerImage || "/coconut-grove.png"}
              alt={page.bannerAlt || "Coconut grove landscape and pathway"}
            />
            <figcaption>
              {page.bannerCaption || "The coconut landscape is part of the living heritage behind Lambanog."}
            </figcaption>
          </figure>
        )}
        {page.callout && <aside className="callout">{page.callout}</aside>}
        {page.steps ? (
          <div className="process-grid">
            {page.steps.map(([number, heading, text, image, alt, caption]) => (
              <article className="process-card" key={number}>
                <span>{number}</span>
                <figure className="process-image">
                  <img src={image} alt={alt} />
                  <figcaption>{caption}</figcaption>
                </figure>
                <div className="process-copy">
                  <h2>{heading}</h2>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="content-grid">{page.sections.map((section) => <PageSection key={section.heading} section={section} />)}</div>
        )}
        {page.extraSections && <div className="content-grid extra-content">{page.extraSections.map((section) => <PageSection key={section.heading} section={section} />)}</div>}
        {PAGE_FEATURES[page.feature]}
        {page.source && <p className="source-note">Source: <a href={page.source.href} target="_blank" rel="noreferrer">{page.source.label}</a></p>}
        {page.sources && <div className="source-note"><strong>Sources</strong><ul>{page.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></div>}
        <div className="related-topics">
          <h2>Related topics</h2>
          <div>{page.related.map((related) => <Link key={related} className="topic-link" href={`/${related}`}>{PAGE_CONTENT[related].nav} <span>→</span></Link>)}</div>
        </div>
        <nav className="previous-next" aria-label="Page navigation">
          {previous ? <Link href={`/${previous}`}><small>Previous</small><strong>{PAGE_CONTENT[previous].nav}</strong></Link> : <span />}
          {next && <Link href={`/${next}`}><small>Next</small><strong>{PAGE_CONTENT[next].nav}</strong></Link>}
        </nav>
      </main>
      <Footer />
    </>
  );
}
