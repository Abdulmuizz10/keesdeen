import React from "react";
import { Header76 } from "../../components/Hero";
import { Banner13 } from "../../components/TestSlide";
import { Gallery21 } from "../../components/NewArrivalsSection";
import { Gallery5 } from "../../components/CollectionSection";
import { Gallery19 } from "../../components/BestSellerSection";

interface HomeProps {
  animation: Boolean;
}

const Home: React.FC<HomeProps> = ({ animation }) => {
  return (
    <>
      {!animation ? (
        <>
          <Header76 />
          <Gallery19 />
          <Banner13 />
          <Gallery5 />
          <Gallery21 />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Home;
