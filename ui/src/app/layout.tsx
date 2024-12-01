import { Roboto } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";

// Carregando a fonte Roboto
const roboto = Roboto({
  subsets: ["latin"], // Você pode adicionar outros subsets caso precise, como "latin-ext"
  weight: ["400", "700"], // Definindo pesos da fonte (normal e negrito)
});

export const metadata: Metadata = {
  title: "FlavorForge",
  description: "O melhor lugar para organizar suas receitas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}> {/* Aplica a fonte Roboto a toda a aplicação */}
        {children}
      </body>
    </html>
  );
}
