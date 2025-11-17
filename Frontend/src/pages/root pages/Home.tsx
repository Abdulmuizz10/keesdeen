import React from "react";
import Hero from "../../components/Hero";
import BestSellersSection from "../../components/BestSellersSection";
import CollectionsSection from "../../components/CollectionsSection";
import TextSlide from "../../components/TestSlide";
import NewArrivalsSection from "../../components/NewArrivalsSection";

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <div className="overflow-hidden">
        <BestSellersSection />
        <TextSlide />
        <CollectionsSection />
        <NewArrivalsSection />
      </div>
    </div>
  );
};

export default Home;
