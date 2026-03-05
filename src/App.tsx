import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import About from "@/components/about";
import Experience from "@/components/experience";
import Projects from "@/components/projects";
import Music from "@/components/music";
import Jogo from "@/components/game";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function App() {
  return (
    <div className="relative min-h-svh bg-background text-foreground antialiased">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 space-y-24">
        <Hero />
        <Music />
        <About />
        <Experience />
        <Projects />
        <Jogo />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
