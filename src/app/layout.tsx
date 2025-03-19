import { Roboto } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false });
const LayoutApp = dynamic(() => import('@/components/Layout/LayoutApp'), { ssr: false });


const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});
export const metadata: Metadata = {
  title: "FullNext Connect",
  description:
    "FullNext é uma solução inovadora para empresas que buscam otimizar o controle e gerenciamento de relatórios Power BI. Com funcionalidades que permitem a organização de relatórios em um sistema multi-tenancy, FullNext visa reduzir gastos com licenças e melhorar o acesso e a gestão de dados de forma eficiente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Layout>
          <LayoutApp>{children}</LayoutApp>
        </Layout>
      </body>
    </html>
  );
}
