import React from "react";
import { Header76 } from "../../components/Hero";
import { Gallery22 } from "../../components/BestSellerSlider";
import { Banner13 } from "../../components/TestSlide";
import { Gallery21 } from "../../components/TrendingSlider";
import { Cta3 } from "../../components/Cta";
import { Testimonial21 } from "../../components/Testimonials";
import { Layout422 } from "../../components/FeauturedProducts";
import { Faq11 } from "../../components/Faq";

const Home: React.FC = () => {
  return (
    <>
      <Header76 />
      <Banner13 />
      <Gallery22 />
      <Layout422 />
      <Cta3 />
      <Gallery21 />
      <Testimonial21 />
      <Faq11 />
    </>
  );
};

export default Home;
