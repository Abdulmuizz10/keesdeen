import React from "react";
import { Header76 } from "../../components/Hero";

import { Banner13 } from "../../components/TestSlide";
import { Gallery4 } from "../../components/BestSellerSection";
import { Gallery21 } from "../../components/Arrivals";
import { Cta3 } from "../../components/Cta";
import { Testimonial21 } from "../../components/Testimonials";
// import { Faq11 } from "../../components/Faq";
import { Gallery5 } from "../../components/CollectionSection";

const Home: React.FC = () => {
  return (
    <>
      <Header76 />
      <Gallery4 />
      <Banner13 />
      <Gallery5 />
      <Cta3 />
      <Gallery21 />
      <Testimonial21 />
    </>
  );
};

export default Home;
