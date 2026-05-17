"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PaymentHeader from "./Header/PaymentHeader";
import PaymentMethods from "./Methods/PaymentMethods";
import OrderSummary from "./Summary/OrderSummary";
import ConfirmButton from "./ConfirmButton/ConfirmButton";
import { useApp } from "@/store/AppContext";

const Payment = () => {
  const [event, setEvent] = useState<any>(null);
  const [checkoutSeats, setCheckoutSeats] = useState<any[]>([]);
  const [seatIds, setSeatIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { releaseSeats } = useApp();

  const totalAmount = checkoutSeats.reduce(
    (sum, seat) => sum + Number(seat.price || 0),
    0
  );

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const eventId = searchParams.get("eventId");

        if (!eventId) {
          throw new Error("Thiếu thông tin sự kiện.");
        }

        const storedSeats = JSON.parse(
          localStorage.getItem("tr_checkout_seats") || "[]"
        );

        if (!Array.isArray(storedSeats) || storedSeats.length === 0) {
          throw new Error("Không có ghế nào trong đơn thanh toán.");
        }

        setCheckoutSeats(storedSeats);
        setSeatIds(storedSeats.map((seat: any) => seat.seatId));

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

        const response = await fetch(`${apiUrl}/user/events/${eventId}`);

        if (!response.ok) {
          throw new Error("Không thể tải thông tin sự kiện.");
        }

        const result = await response.json();
        const eventData = result.data;

        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL_BASE || "http://localhost:8000";

        eventData.image = eventData.image?.startsWith("/")
          ? `${baseUrl}${eventData.image}`
          : eventData.image ||
            "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1000&q=80";

        setEvent(eventData);
      } catch (err: any) {
        setError(err.message || "Lỗi tải thanh toán.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [searchParams, router]);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

      const response = await fetch(`${apiUrl}/user/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event.id,
          seats: checkoutSeats,
          paymentMethod: "bank",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Thanh toán thất bại.");
      }

      if (seatIds.length > 0) {
        releaseSeats(seatIds);
      }

      localStorage.removeItem("tr_checkout_seats");

      alert("Thanh toán thành công! Bạn có thể xem vé ngay bây giờ.");
      router.push("/my-tickets");
    } catch (err: any) {
      alert(err.message || "Thanh toán thất bại.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#08080f] flex items-center justify-center text-white">
        Đang tải...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#08080f] flex items-center justify-center text-red-500">
        {error}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08080f] pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PaymentHeader />

        <div className="grid lg:grid-cols-5 gap-6 mt-6">
          <div className="lg:col-span-3 flex flex-col gap-4">
            <PaymentMethods
              amount={totalAmount}
              eventId={event?.id || ""}
              seatIds={seatIds}
            />

            <ConfirmButton
              onConfirm={handleConfirmPayment}
              isProcessing={isProcessing}
            />
          </div>

          <OrderSummary
            event={event}
            checkoutSeats={checkoutSeats}
            totalAmount={totalAmount}
          />
        </div>
      </div>
    </main>
  );
};

export default Payment;