import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | FullNext Connect",
  description:
    "Acesse sua conta no FullNext para gerenciar relatórios de forma eficiente e segura.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="absolute left-0 right-0 top-0 bottom-0 z-20">{children}</main>
  );
}
