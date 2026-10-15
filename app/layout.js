import "./globals.css";
export const metadata = {
  title: {
    default: "Tree of Life",
    template: "%s | Tree of Life",
  },
  description: "A digital heritage platform for Lambanog of Lipahan, San Juan, Batangas.",
  icons: {
    icon: "/tree-of-life-logo.png",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Figtree:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
