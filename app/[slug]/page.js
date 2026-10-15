import { notFound } from "next/navigation";
import Header from "../../components/Header";
import ContentPage from "../../components/ContentPage";
import { PAGE_CONTENT, PAGE_ORDER } from "../../lib/pages";

export function generateStaticParams() {
  return PAGE_ORDER.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const page = PAGE_CONTENT[params.slug];
  return page ? { title: page.title, description: page.intro } : {};
}

export default function Page({ params }) {
  if (!PAGE_CONTENT[params.slug]) notFound();
  return <><Header /><ContentPage slug={params.slug} /></>;
}
