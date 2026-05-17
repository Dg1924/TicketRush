"use client";

type CheckoutSeat = {
  seatId: string;
  tierId: number | string;
  tierName: string;
  price: number;
};

type Props = {
  event: any;
  checkoutSeats: CheckoutSeat[];
  totalAmount: number;
};

const OrderSummary = ({ event, checkoutSeats, totalAmount }: Props) => {
  const serviceFee = 0;
  const total = totalAmount + serviceFee;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="lg:col-span-2">
      <div className="bg-[#11111a] border border-gray-800 rounded-2xl p-6 sticky top-24">
        <h3 className="text-xl font-bold text-white mb-6">Tóm tắt đơn hàng</h3>

        <div className="mb-6">
          <h4 className="text-white font-semibold text-lg line-clamp-2">
            {event?.title}
          </h4>

          <p className="text-gray-400 text-sm mt-2">
            📍 {event?.venue} • {event?.city}
          </p>

          {event?.date && (
            <p className="text-gray-400 text-sm mt-1">
              📅 {new Date(event.date).toLocaleDateString("vi-VN")}
            </p>
          )}
        </div>

        <div className="border-t border-gray-800 pt-4 space-y-3 mb-6">
          {checkoutSeats.map((seat) => {
            const parts = seat.seatId.split("_");
            const seatLabel =
              parts.length >= 3 ? `${parts[1]}${parts[2]}` : seat.seatId;

            return (
              <div
                key={seat.seatId}
                className="flex justify-between gap-3 text-gray-300"
              >
                <span>
                  {seat.tierName || "Vé"} - Ghế {seatLabel}
                </span>

                <span className="shrink-0">{formatPrice(Number(seat.price || 0))}</span>
              </div>
            );
          })}

          <div className="flex justify-between text-gray-300">
            <span>Phí dịch vụ</span>
            <span>{serviceFee === 0 ? "Miễn phí" : formatPrice(serviceFee)}</span>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 mt-2 flex justify-between items-center">
          <span className="text-white font-bold text-lg">Tổng thanh toán</span>
          <span className="text-orange-400 font-bold text-2xl">
            {formatPrice(total)}
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Bằng việc xác nhận thanh toán, bạn đồng ý với Điều khoản và Dịch vụ của Ticket Rush.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;