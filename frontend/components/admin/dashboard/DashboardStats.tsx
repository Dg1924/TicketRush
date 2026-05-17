import { CalendarCheck, DollarSign, Ticket, Users } from "lucide-react";
import type { Event } from "@/data/events";
import StatCard from "./StatCard";

type Order = {
  quantity: number;
};

type Props = {
  events: Event[];
  orders: Order[];
  totalRevenue: number;
  soldSeats: number;
  heldSeats: number;
};

const DashboardStats = ({
  events,
  orders,
  totalRevenue,
  soldSeats,
  heldSeats,
}: Props) => {
  const displayTickets = Number(soldSeats); 

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

      <StatCard
        icon={Ticket}
        label="Vé đã bán"
        value={displayTickets.toLocaleString('vi-VN')}
        color="bg-purple-600/80"
      />

      <StatCard
        icon={DollarSign}
        label="Tổng doanh thu"
        value={`${Number(totalRevenue).toLocaleString('vi-VN')}đ`}
        color="bg-emerald-600/80"
      />

      <StatCard
        icon={Users}
        label="Tổng đơn hàng"
        value={String(orders.length)}
        color="bg-blue-600/80"
      />
    </div>
  );
};

export default DashboardStats;