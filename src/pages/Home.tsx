
import React from "react";
import MainLayout from "@/components/Layout/MainLayout";

const Home: React.FC = () => {
  return (
    <MainLayout title="Home | MobiShop">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-center">Welcome to MobiShop</h1>
      </div>
    </MainLayout>
  );
};

export default Home;
