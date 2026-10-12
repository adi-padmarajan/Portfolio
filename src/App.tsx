import { useCallback, useEffect, useState } from "react";
import { CoffeeProgress, Navbar } from "./components";
import { prefersReducedMotion } from "./lib/motion";
import { initSmoothScroll } from "./lib/smoothScroll";
import { About, Contact, Experience, Home, Languages, Projects } from "./pages/";

const INTRO_SEEN_KEY = "introSeen";

// Play the intro only on a fresh visit: not once it has been seen this session,
// and not for visitors who prefer reduced motion
function shouldPlayIntro(){
  try {
    if (sessionStorage.getItem(INTRO_SEEN_KEY)) return false;
  } catch {
    // Storage can be blocked; fall through and play the intro
  }
  return !prefersReducedMotion();
}

function App() {
  const [showIntro, setShowIntro] = useState(shouldPlayIntro);
  const [showSite, setShowSite] = useState(!showIntro);

  useEffect(() => initSmoothScroll(), []);

  const handleReveal = useCallback(() => setShowSite(true), []);
  const handleIntroComplete = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "true");
    } catch {
      // Ignore; the intro will just play again on reload
    }
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <Languages onReveal={handleReveal} onComplete={handleIntroComplete} />}
      {showSite && (
        <>
          <Navbar />
          <CoffeeProgress />
          <main id="top">
            <Home introActive={showIntro} />
            <section id="about">
              <About />
            </section>
            <section id="experience" className="scroll-mt-20">
              <Experience />
            </section>
            <section id="work" className="scroll-mt-20">
              <Projects />
            </section>
            <section id="contact">
              <Contact />
            </section>
          </main>
        </>
      )}
    </>
  )
}

export default App
