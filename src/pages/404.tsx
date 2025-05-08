
import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Link } from "react-router-dom";

const Page404: React.FC = () => {
  return (
    <MainLayout title="Page Not Found | MobiShop">
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-medium my-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    </MainLayout>
  );
};

export default Page404;
