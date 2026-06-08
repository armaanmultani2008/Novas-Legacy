import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Mission from './components/Mission';

function App() {
    return (
        <div className="app-container">
            {/* --- PARTE PERSONA 1 --- */}
            <Navbar />
            <Hero />
            <Mission />

            {/* --- SPAZIO PER LA PERSONA 2 --- */}
            {/* Qui il tuo compagno di team inserirà i suoi componenti, ad esempio:
        <Stats />
        <CheetahCarousel />
        <Footer />
      */}
        </div>
    );
}

export default App;