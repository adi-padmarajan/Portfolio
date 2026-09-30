import { useCallback, useState } from "react";
import { Navbar } from "./components";
import { About, Contact, Home, Languages, Projects } from "./pages/";

const INTRO_SEEN_KEY = "introSeen";

// Play the intro only on a fresh visit: not once it has been seen this session,
// and not for visitors who prefer reduced motion
function shouldPlayIntro(){
  try {
    if (sessionStorage.getItem(INTRO_SEEN_KEY)) return false;
  } catch {
    // Storage can be blocked; fall through and play the intro
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function App() {
  const [showIntro, setShowIntro] = useState(shouldPlayIntro);
  const [showSite, setShowSite] = useState(!showIntro);

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
          <main id="top">
            <Home />
            <section id="work" className="scroll-mt-20">
              <Projects />
            </section>
            <section id="about" className="scroll-mt-20">
              <About />
            </section>
            <section id="contact" className="scroll-mt-20">
              <Contact />
            </section>
          </main>
        </>
      )}
    </>
  )
}

export default App
