import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

type Order = {
  id: number;
  eventTitle: string;
  buyerName: string;
  buyerEmail: string;
  seat: string; 
  tierName: string;
  price: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
};

type Props = {
  orders: Order[];
};

const OrdersTable = ({ orders }: Props) => {
  return (
    <div className="bg-[#12121e] border border-white/8 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/8 bg-white/2">
              {["Mã", "Sự kiện", "Khách hàng", "Vị trí ghế", "Giá vé", "Trạng thái", "Ngày đặt"].map((header) => (
                <th key={header} className="text-gray-500 text-xs px-5 py-4 font-normal uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/3 transition-colors text-gray-300">
                <td className="px-5 py-4 font-mono text-orange-400 text-xs">#{order.id}</td>
                
                <td className="px-5 py-4 font-medium">
                  <p className="truncate max-w-[150px]">{order.eventTitle}</p>
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span>{order.buyerName}</span>
                    <span className="text-[10px] text-gray-500">{order.buyerEmail}</span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="text-gray-400 text-xs bg-white/5 px-2 py-1 rounded">
                    {order.seat ? order.seat.replace(/_/g, " ") : "N/A"}
                  </span>
                </td>

                <td className="px-5 py-4 font-bold text-emerald-400">
                  {Number(order.price || 0).toLocaleString('vi-VN')}đ
                </td>

                <td className="px-5 py-4">
                  {order.status === 'paid' ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs">
                      <CheckCircle size={14} /> Đã xong
                    </span>
                  ) : order.status === 'pending' ? (
                    <span className="flex items-center gap-1 text-orange-400 text-xs">
                      <Clock size={14} /> Chờ duyệt
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-xs">
                      <XCircle size={14} /> Đã hủy
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-gray-500 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-[10px] text-gray-500 pl-4.5">
                    {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;