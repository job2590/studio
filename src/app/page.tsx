import { Calculator } from '@/components/calculator';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <h1 className="text-xl font-bold tracking-tight text-primary">Calculadora de Valor BOB</h1>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-6">
        <Calculator />
      </main>
      <footer className="flex items-center justify-center p-4 text-center text-sm text-muted-foreground">
        <p>Hecho con ❤️ para la comunidad.</p>
      </footer>
    </div>
  );
}
