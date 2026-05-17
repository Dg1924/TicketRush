"use client";

import { useEffect, useState } from "react";
import OrdersHeader from "./OrdersHeader";
import EmptyOrders from "./EmptyOrders";
import OrdersTable from "./OrdersTable";
import { Loader2 } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setOrders(result.data?.orders || result.data || []);
      }
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <p className="text-gray-500">Đang tải danh sách đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <OrdersHeader total={orders.length} />

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <OrdersTable orders={orders} onRefresh={fetchOrders} />
      )}
    </div>
  );
};

export default AdminOrders;