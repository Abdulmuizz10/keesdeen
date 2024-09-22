import React from "react";
import { Header76 } from "../../components/Hero";

import { Banner13 } from "../../components/TestSlide";
import { Gallery4 } from "../../components/BestSellerSlider";
import { Gallery21 } from "../../components/Arrivals";
import { Cta3 } from "../../components/Cta";
import { Testimonial21 } from "../../components/Testimonials";
import { Layout422 } from "../../components/FeauturedProducts";
// import { Faq11 } from "../../components/Faq";
import { Gallery5 } from "../../components/CollectionSlider";

const Home: React.FC = () => {
  return (
    <>
      <Header76 />
      <Banner13 />
      <Gallery4 />
      <Gallery5 />
      <Layout422 />
      <Gallery21 />
      <Cta3 />
      <Testimonial21 />

      {/* <Faq11 /> */}
    </>
  );
};

export default Home;
