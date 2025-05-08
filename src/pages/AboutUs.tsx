
import React from "react";
import MainLayout from "@/components/Layout/MainLayout";

const AboutUs: React.FC = () => {
  return (
    <MainLayout title="About Us | MobiShop">
      <div className="py-8">
        <h1 className="text-2xl font-bold">About Us</h1>
        <p>Information about our company will be displayed here</p>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
