import React from "react";
import Hero from "../../components/Hero";
import BestSellersSection from "../../components/BestSellersSection";
import CollectionsSection from "../../components/CollectionsSection";
import TextSlide from "../../components/TestSlide";
import NewArrivalsSection from "../../components/NewArrivalsSection";

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <BestSellersSection />
      <TextSlide />
      <CollectionsSection />
      <NewArrivalsSection />
    </div>
  );
};

export default Home;
