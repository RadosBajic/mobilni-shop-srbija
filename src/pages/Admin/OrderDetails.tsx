
import React from "react";
import AdminLayout from "@/components/Admin/AdminLayout";

const OrderDetails: React.FC = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <p>Order details will be displayed here.</p>
      </div>
    </AdminLayout>
  );
};

export default OrderDetails;
