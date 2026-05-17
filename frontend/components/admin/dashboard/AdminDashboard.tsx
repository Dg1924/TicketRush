"use client";

import { useMemo, useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import SalesChart from "./SalesChart";
import RevenueChart from "./RevenueChart";
import RecentOrders from "./RecentOrders";
import QuickActions from "./QuickActions";
import AudienceStats from "./AudienceStats";

const AdminDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverStats, setServerStats] = useState({ totalRevenue: 0, soldTickets: 0 });
  const [audience, setAudience] = useState({ genders: [], ages: [], total: 0 });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const token = localStorage.getItem("token");

        const response = await fetch(`${apiUrl}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const result = await response.json();

        if (response.ok) {
          setEvents(result.data.events || []);
          setOrders(result.data.orders || []);
          // Lưu lại các con số tổng đã được Backend tính sẵn
          setServerStats({
            totalRevenue: Number(result.data.totalRevenue || 0),
            soldTickets: Number(result.data.soldTickets || 0)
          });
          if (result.data.audience) {
            setAudience(result.data.audience);
          }
        }
      } catch (err) {
        console.error("Lỗi kết nối API:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalRevenue = useMemo(() => {
    if (serverStats.totalRevenue > 0) return serverStats.totalRevenue;
    
    return orders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + (Number(order.price) || 0), 0);
  }, [orders, serverStats.totalRevenue]);

  const soldSeats = useMemo(() => {
    if (serverStats.soldTickets > 0) return serverStats.soldTickets;
    
    return orders.filter(order => order.status === 'paid').length;
  }, [orders, serverStats.soldTickets]);

  const revenueByEvent = useMemo(() => {
    const revenueMap: Record<string, number> = {};
    orders.forEach((order) => {
      if (order.status === 'paid') {
        const title = order.eventTitle || "Sự kiện không tên";
        revenueMap[title] = (revenueMap[title] ?? 0) + (Number(order.price) || 0);
      }
    });
    return Object.entries(revenueMap)
      .map(([name, revenue]) => ({
        name: name.length > 18 ? `${name.slice(0, 16)}…` : name,
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [orders]);

  const salesOverTime = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return {
        day: date.toLocaleDateString("vi-VN", { weekday: "short" }),
        tickets: 0,
        revenue: 0,
        rawDate: date.toISOString().split('T')[0]
      };
    });

    orders.forEach((order) => {
      if (order.status === 'paid') {
        const localDate = new Date(order.createdAt);

const orderDate =
  `${localDate.getFullYear()}-` +
  `${String(localDate.getMonth() + 1).padStart(2, "0")}-` +
  `${String(localDate.getDate()).padStart(2, "0")}`;
        const entry = days.find((day) => day.rawDate === orderDate);
        if (entry) {
          entry.tickets += 1; // Mỗi dòng là 1 vé
          entry.revenue += (Number(order.price) || 0);
        }
      }
    });

    return days;
  }, [orders]);

  const genderData = useMemo(() => {
    return audience.genders.map((g: any) => ({
      gender: g.gender,
      count: g.count,
      pct: Math.round((g.count / audience.total) * 100)
    }));
  }, [audience]);

  const ageData = useMemo(() => {
    return audience.ages.map((a: any) => ({
      group: a.ageGroup,
      count: a.count,
      pct: Math.round((a.count / audience.total) * 100)
    }));
  }, [audience]);

  const uniqueOrders = useMemo(() => {
    const orderMap = new Map();

    orders.forEach(ticket => {
      // Gộp các vé có cùng Email người mua và cùng thời gian mua thành 1 đơn
      const key = `${ticket.buyerEmail}_${ticket.createdAt}`;
      
      if (!orderMap.has(key)) {
        // Nếu là vé đầu tiên của đơn này -> Lưu vào Map
        orderMap.set(key, { 
          ...ticket, 
          totalOrderPrice: Number(ticket.price) || 0,
          seatList: ticket.seat ? [ticket.seat] : []
        });
      } else {
        // Nếu là vé thứ 2, 3 của cùng đơn -> Cộng dồn tiền và nối thêm ghế
        const existingOrder = orderMap.get(key);
        existingOrder.totalOrderPrice += (Number(ticket.price) || 0);
        if (ticket.seat) existingOrder.seatList.push(ticket.seat);
      }
    });

    // Chuyển lại thành mảng và format dữ liệu để các Component con đọc được
    return Array.from(orderMap.values()).map(order => ({
      ...order,
      price: order.totalOrderPrice, // Đổi giá thành: Tổng tiền của cả đơn
      seat: order.seatList.join(", ") // Nối tên các ghế lại với nhau (VD: "1_A, 1_B")
    }));
  }, [orders]);

  if (isLoading) {
    return <div className="p-6 text-white text-center">Đang tải dữ liệu hệ thống...</div>;
  }

  return (
    <div className="p-6">
      <DashboardHeader />

      <DashboardStats
        events={events}
        orders={uniqueOrders}
        totalRevenue={totalRevenue}
        soldSeats={soldSeats}
        heldSeats={0}
      />

      <SalesChart data={salesOverTime} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 mt-8">
        <div className="xl:col-span-1">
          <RevenueChart data={revenueByEvent} />
        </div>
        <div className="xl:col-span-2">
          <AudienceStats 
            genderData={genderData} 
            ageData={ageData} 
            totalAudience={audience.total} 
          />
        </div>
      </div>

      <RecentOrders orders={orders} />

      <QuickActions />
    </div>
  );
};

export default AdminDashboard;