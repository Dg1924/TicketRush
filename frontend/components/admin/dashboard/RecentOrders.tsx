"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Ticket } from "lucide-react";
import { useMemo } from "react";

type Order = {
  id: string | number;
  eventTitle: string;
  buyerName: string;
  buyerEmail: string;
  price: number | string;
  status: string;
  createdAt: string | number;
};

type Props = {
  orders: Order[];
};

const RecentOrders = ({ orders }: Props) => {
  const router = useRouter();

  const displayOrders = useMemo(() => {
    const groups: Record<string, any> = {};

    orders.forEach((order) => {
      const timeKey = new Date(order.createdAt).getTime().toString().slice(0, -3);
      const groupKey = `${order.buyerEmail}-${order.eventTitle}-${timeKey}`;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          ...order,
          totalQuantity: 1,
          totalPrice: Number(order.price || 0),
        };
      } else {
        groups[groupKey].totalQuantity += 1;
        groups[groupKey].totalPrice += Number(order.price || 0);
      }
    });

    return Object.values(groups)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="bg-[#12121e] border border-white/8 rounded-2xl overflow-hidden mb-8 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-orange-400" />
          <h3 className="text-white font-medium text-sm">Đơn hàng gần đây</h3>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/orders")}
          className="flex items-center gap-1 text-orange-400 text-xs hover:text-orange-300 transition-colors"
        >
          Xem tất cả
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {displayOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm italic">Chưa có đơn hàng nào được ghi nhận.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Mã đơn", "Sự kiện", "Khách hàng", "Số vé", "Tổng tiền", "Ngày đặt"].map(
                  (header) => (
                    <th
                      key={header}
                      className="text-left text-gray-500 text-[11px] px-5 py-4 font-normal uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {displayOrders.map((order: any) => (
                <tr
                  key={order.id}
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-5 py-4">
                    <span className="text-orange-400 font-mono text-xs font-medium">
                      #{String(order.id).padStart(4, '0')}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-gray-300 font-medium truncate max-w-[180px]" title={order.eventTitle}>
                      {order.eventTitle}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-300">{order.buyerName}</span>
                      <span className="text-[10px] text-gray-500 italic">{order.buyerEmail}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="bg-white/5 text-gray-400 px-2 py-0.5 rounded text-[11px] border border-white/5">
                      {order.totalQuantity} vé
                    </span>
                  </td>

                  <td className="px-5 py-4 font-bold text-emerald-400">
                    {Number(order.totalPrice).toLocaleString('vi-VN')}đ
                  </td>

                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                    <div className="text-[10px] text-gray-500 pl-4.5">
                      {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;