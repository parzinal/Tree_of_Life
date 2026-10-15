import Link from "next/link";
import { PAGE_CONTENT } from "../lib/pages";

export default function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <img src="/tree-of-life-logo.png" alt="" aria-hidden="true" />
        <span>Tree of Life</span>
      </Link>
      <nav className="main-nav" aria-label="Main">
        <Link href="/">Home</Link>
        {Object.entries(PAGE_CONTENT).map(([slug, page]) => (
          <Link key={slug} href={`/${slug}`}>{page.nav}</Link>
        ))}
      </nav>
    </header>
  );
}
