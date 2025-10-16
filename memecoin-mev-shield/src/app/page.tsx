// src/app/page.tsx
import { MemeTraderUI } from '@/components/MemeTrader';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-yellow-100 to-orange-100">
      <MemeTraderUI />
    </main>
  );
}