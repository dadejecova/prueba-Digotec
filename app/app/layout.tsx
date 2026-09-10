import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Digotec Analytics | Cartera de Clientes',
  description:
    'Dashboard ejecutivo de analítica de cartera bancaria. Segmentación de clientes, KPIs de negocio y alertas de vencimiento.',
  keywords: 'analítica, banca, cartera, clientes, Power BI, dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
