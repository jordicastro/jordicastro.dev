import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance - JordiCastro.dev",
  description: "Maintenance Page for JordiCastro.dev",
  icons: [
    {
      media: "(prefers-color-scheme: light)",
      url: "/images/logos/JordPle.png",
      href: "/images/logos/JordPle.png",
    },
    {
      media: "(prefers-color-scheme: dark)",
      url: "/images/logos/JordPle.png",
      href: "/images/logos/JordPle.png",
    }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
