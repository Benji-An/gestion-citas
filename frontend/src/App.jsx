import Navbar from './components/Navbar';
import Slider from './components/Slider';
import Benefits from './components/Benefits';
import Testimonials from './components/Opinions';
import FAQ from './components/FAQ';
import Footer from './components/Footer';  

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Slider />
      </div>
      <Benefits />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;