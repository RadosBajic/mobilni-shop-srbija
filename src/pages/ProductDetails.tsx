
import React from "react";
import MainLayout from "@/components/Layout/MainLayout";

const ProductDetails: React.FC = () => {
  return (
    <MainLayout title="Product Details | MobiShop">
      <div className="py-8">
        <h1 className="text-2xl font-bold">Product Details</h1>
        <p>Product details will be displayed here</p>
      </div>
    </MainLayout>
  );
};

export default ProductDetails;
