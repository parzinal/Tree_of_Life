import Link from "next/link";
import { PAGE_CONTENT } from "../lib/pages";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Tree of Life</strong>
        <p>From Crisis to Comeback: Lambanog Heritage Tourism</p>
        <p>Lipahan, San Juan, Batangas</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/">Home</Link>
        {Object.entries(PAGE_CONTENT).map(([slug, page]) => <Link key={slug} href={`/${slug}`}>{page.nav}</Link>)}
      </nav>
      <small>Educational heritage project. Verify safety information with current official authorities.</small>
    </footer>
  );
}
