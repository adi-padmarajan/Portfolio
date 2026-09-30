import { Navbar } from "./components";
import { About, Contact, Home, Projects } from "./pages/";

function App() {

  return (
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
  )
}

export default App
