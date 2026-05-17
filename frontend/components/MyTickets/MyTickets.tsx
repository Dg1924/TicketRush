"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { X, Ticket as TicketIcon } from "lucide-react";
import EmptyTickets from "./EmptyTickets/EmptyTickets";

interface Ticket {
  id: number;
  eventId: number;
  title: string; 
  date: string;
  image: string;
  seat: string;
  status: string;
  price: number;
}

const MyTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const response = await fetch(`${apiUrl}/user/my-tickets`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        if (!response.ok) throw new Error("Không thể tải danh sách vé");

        const data = await response.json();
        setTickets(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTickets();
  }, [router]);

  if (isLoading) return <main className="min-h-screen bg-[#08080f] pt-24 flex justify-center text-white">Đang tải vé...</main>;
  if (error) return <main className="min-h-screen bg-[#08080f] pt-24 flex justify-center text-red-500">{error}</main>;

  return (
    <main className="min-h-screen bg-[#08080f] pt-24 pb-12 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <TicketIcon className="w-8 h-8 text-orange-500" />
          Vé Của Tôi
        </h1>
        
        {tickets.length === 0 ? (
          <div className="bg-[#12121e] border border-white/10 rounded-2xl p-6 shadow-xl">
            <EmptyTickets />
          </div>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-[#12121e] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 hover:border-orange-500/50 transition-colors">
                
                <div className="flex-1 w-full">
                  <h3 className="text-xl font-semibold text-white mb-2">{ticket.title || "Tên sự kiện"}</h3>
                  <div className="flex flex-col gap-1.5 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <TicketIcon className="w-4 h-4 text-orange-400"/> Ghế: <strong className="text-white">{ticket.seat || "Chưa chọn"}</strong> - Mã vé: {ticket.id}
                    </span>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-3">
                  {ticket.status === 'paid' ? (
                    <span className="bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-sm font-medium border border-green-500/20">
                      Đã thanh toán
                    </span>
                  ) : (
                    <span className="bg-yellow-500/10 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-medium border border-yellow-500/20">
                      Chờ xử lý
                    </span>
                  )}

                  <button 
                    onClick={() => setSelectedTicket(ticket)}
                    className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-xl transition-colors"
                  >
                    Xem chi tiết & QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POPUP HIỂN THỊ MÃ QR CODE KHI CLICK XEM CHI TIẾT */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <div className="bg-[#12121e] p-6 text-center text-white">
              <h2 className="text-2xl font-bold mb-1">{selectedTicket.title}</h2>
              <p className="text-orange-400">Vé điện tử chính thức</p>
            </div>

            <div className="p-8 flex flex-col items-center bg-gray-50">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6">
                <QRCode 
                  value={`TICKETRUSH-${selectedTicket.eventId}-${selectedTicket.id}-${selectedTicket.seat}`} 
                  size={200}
                  level="H"
                />
              </div>
              
              <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between border-b border-gray-100 pb-3 mb-3">
                  <span className="text-gray-500">Mã vé (ID)</span>
                  <span className="font-semibold text-gray-900">#{selectedTicket.id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3 mb-3">
                  <span className="text-gray-500">Mã ghế (Seat)</span>
                  <span className="font-bold text-orange-500 text-lg">{selectedTicket.seat || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái</span>
                  <span className={`font-semibold ${selectedTicket.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {selectedTicket.status === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MyTickets;