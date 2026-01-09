import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Intro from '../components/Intro';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black">
      <Header />
      <Hero />
      <Intro />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;