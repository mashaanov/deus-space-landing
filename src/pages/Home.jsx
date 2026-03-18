import React from "react";
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";

const Home = () => {
  return (
    <Layout>
      <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[var(--color-purple-400)] to-[var(--color-purple-600)] bg-clip-text text-transparent">
        Наши кавер-группы
      </h2>
      <p className="text-center text-[var(--color-deus-white)]/70 mb-12 max-w-2xl mx-auto">
        Любой жанр, любой формат — подберём музыку для вашего мероприятия
      </p>
      <Carousel />
    </Layout>
  );
};

export default Home;
