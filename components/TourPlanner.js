"use client";

const TOURISM_CONTACT = "https://tourism.sanjuanbatangas.gov.ph/contact-us";
const HERITAGE_SOURCE = "https://tourism.sanjuanbatangas.gov.ph/culture-and-heritage";
const TRAVEL_SOURCE = "https://tourism.sanjuanbatangas.gov.ph/plan-your-trip";
const FDA_PORTAL = "https://verification.fda.gov.ph/";
const ROUTE_URL = "https://www.google.com/maps/dir/?api=1&origin=San+Juan+Municipal+Tourism+Reception+Area%2C+Buhaynasapa%2C+San+Juan%2C+Batangas&destination=Lipahan%2C+San+Juan%2C+Batangas&waypoints=Pinagbayanan+Ruins%2C+San+Juan%2C+Batangas%7CSan+Juan+Nepomuceno+Parish+Church%2C+San+Juan%2C+Batangas&travelmode=driving";

const ROUTE_STOPS = [
  {
    number: "01",
    title: "Start: Municipal Tourism Reception Area",
    location: "Buhaynasapa, San Juan, Batangas",
    detail: "The Municipal Tourism Office lists its reception area in Buhaynasapa as operating 24/7 and its office hours as Monday–Thursday, 7:00 AM–6:00 PM. Published contact: +63 961 955 2607 and tourism@sanjuanbatangas.gov.ph. Call or email to check current road conditions, guide availability, site access and local requirements.",
    action: "Contact the Municipal Tourism Office",
    href: TOURISM_CONTACT,
  },
  {
    number: "02",
    title: "Pinagbayanan Ruins",
    location: "Pinagbayanan, San Juan, Batangas",
    detail: "Visit the remains of San Juan's former town site. The municipal history says the church and municipal hall were built here in 1843; flooding beginning in 1883 led to the town's relocation. Confirm access and site conditions before visiting.",
    action: "Open Pinagbayanan Ruins in Maps",
    href: "https://www.google.com/maps/search/?api=1&query=Pinagbayanan+Ruins%2C+San+Juan%2C+Batangas",
  },
  {
    number: "03",
    title: "San Juan Nepomuceno Parish Church",
    location: "Present-day town center, San Juan, Batangas",
    detail: "Continue to the present town center and the parish church named in the municipal heritage account. Treat this as an active religious site: observe posted visiting hours, dress respectfully and avoid disrupting services.",
    action: "Find the parish church in Maps",
    href: "https://www.google.com/maps/search/?api=1&query=San+Juan+Nepomuceno+Parish+Church%2C+San+Juan%2C+Batangas",
  },
  {
    number: "04",
    title: "Lambanog production heritage in Lipahan",
    location: "Barangay Lipahan, San Juan, Batangas",
    detail: "Lipahan is a Lambanog-producing area. Jimmy's Lambanog has appeared in public product-search records and Municipal Tourism Office material about tourism validation, making it a lead to ask about—not a confirmed attraction. This page cannot confirm current product-registration status, factory access, tour availability or opening hours. Do not arrive unannounced: ask the Tourism Office to confirm whether the producer currently receives visitors.",
    action: "Ask the Municipal Tourism Office to confirm visits",
    href: TOURISM_CONTACT,
    secondaryAction: "Search current FDA product records",
    secondaryHref: FDA_PORTAL,
    sourceAction: "Check the official Tourism of San Juan page",
    sourceHref: "https://www.facebook.com/juanderfulsanjuan",
  },
];

const OPTIONAL_STOP = {
  title: "Optional nature extension: Pinagbayan and Poctol mangroves",
  detail: "The Municipal Tourism Office identifies mangrove forest areas in Barangays Pinagbayan and Poctol. This is a separate nature stop, not a Lambanog production site. Ask the Tourism Office about access, local guides, tide/weather conditions and conservation rules before adding it.",
  href: "https://www.google.com/maps/search/?api=1&query=mangrove+forest+Pinagbayan+Poctol+San+Juan+Batangas",
};

export default function TourPlanner() {
  return (
    <div className="feature-stack">
      <section className="feature-panel" aria-labelledby="trail-planner-title">
        <p className="eyebrow">Branch 3 · Tourism experiences</p>
        <h2 id="trail-planner-title">San Juan Heritage-to-Lipahan Lambanog Route</h2>
        <p className="feature-intro">A practical, map-linked route connecting San Juan's documented heritage places with the Lambanog-producing barangay of Lipahan. This is a visitor itinerary proposal, not a certified or currently operated commercial tour. A producer visit requires advance confirmation and permission.</p>
        <a className="feature-button feature-button-primary route-button" href={ROUTE_URL} target="_blank" rel="noreferrer">Open full route in Google Maps</a>
        <ol className="route-stops">
          {ROUTE_STOPS.map((stop) => (
            <li className="route-stop" key={stop.number}>
              <span className="route-number">{stop.number}</span>
              <div>
                <p className="eyebrow">{stop.location}</p>
                <h3>{stop.title}</h3>
                <p>{stop.detail}</p>
                <a className="text-link" href={stop.href} target="_blank" rel="noreferrer">{stop.action}</a>
                {stop.secondaryAction && <a className="text-link" href={stop.secondaryHref} target="_blank" rel="noreferrer">{stop.secondaryAction}</a>}
                {stop.sourceAction && <a className="text-link" href={stop.sourceHref} target="_blank" rel="noreferrer">{stop.sourceAction}</a>}
              </div>
            </li>
          ))}
        </ol>
        <div className="route-note">
          <h3>Getting to San Juan</h3>
          <p>The Municipal Tourism Office's travel guide describes direct ALPS bus service from Alabang or EDSA-Taft and an alternate Lipa-to-San Juan jeepney connection. For drivers from Manila, it describes SLEX, STAR Tollway and the Ibaan exit. Check the linked guide and transport providers for current routes, fares, schedules and road conditions; these can change.</p>
          <a className="text-link" href={TRAVEL_SOURCE} target="_blank" rel="noreferrer">San Juan Municipal Tourism Office — Plan Your Trip</a>
        </div>
        <p className="callout">There are no verified distances, journey times, factory tour slots or booking rates published here. Use live directions and confirm each stop with the host before travel. Do not drink and drive; a production visit can be educational without alcohol consumption.</p>
      </section>

      <section className="feature-panel" aria-labelledby="festival-listings-title">
        <p className="eyebrow">Festival information · San Juan</p>
        <h2 id="festival-listings-title">Lambayok Festival and local traditions</h2>
        <p>The Municipal Tourism Office describes Lambayok as celebrating Lambanog (coconut wine), palayok (clay pots) and karagatan (the sea). Its heritage page says the annual festival coincides with San Juan's foundation day on December 12 and includes street dancing, parades and other festivities. The specific program, road closures and event access vary by year; check the latest municipal announcement before making plans.</p>
        <p>The same municipal account lists the Feast of San Juan Nepomuceno on May 16 and describes a procession of decorated boats carrying the patron saint's image along the coast. Confirm the year's schedule and viewing arrangements with local organizers.</p>
        <a className="text-link" href={HERITAGE_SOURCE} target="_blank" rel="noreferrer">Source: San Juan Municipal Tourism Office — Culture and Heritage</a>
      </section>

      <section className="feature-panel" aria-labelledby="optional-nature-title">
        <p className="eyebrow">Optional extension</p>
        <h2 id="optional-nature-title">{OPTIONAL_STOP.title}</h2>
        <p>{OPTIONAL_STOP.detail}</p>
        <a className="text-link" href={OPTIONAL_STOP.href} target="_blank" rel="noreferrer">Search the area in Google Maps</a>
      </section>

      <section className="feature-panel" aria-labelledby="tourism-safety-title">
        <h2 id="tourism-safety-title">Before you go</h2>
        <ul className="detail-list">
          <li><strong>Arrange private visits in advance.</strong><span>Farm and production facilities are workplaces, not automatically open tourist attractions. Get the owner's permission and follow site safety instructions.</span></li>
          <li><strong>Verify tour providers.</strong><span>San Juan has a municipal Tourism Compliance Certificate policy for tourism-related establishments. Ask the Tourism Office which guides and businesses are currently registered.</span></li>
          <li><strong>Check product information separately.</strong><span>A place name or brand is not proof that a particular bottle is safe. Verify the specific product's current registration and labeling through the FDA, and follow current health advisories.</span></li>
          <li><strong>Respect people and places.</strong><span>Ask before taking photographs or recording interviews, avoid interrupting religious services or production, and follow environmental guidance at natural sites.</span></li>
        </ul>
        <a className="text-link" href="https://tourism.sanjuanbatangas.gov.ph/data-governance/ordinances-resolutions" target="_blank" rel="noreferrer">Source: San Juan tourism ordinances and resolutions</a>
      </section>
    </div>
  );
}
