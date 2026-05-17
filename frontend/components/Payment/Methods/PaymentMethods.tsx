import BankTransferUI from "../Bank/BankTransferUI";

interface Props {
  amount: number;
  eventId: string | number;
  seatIds: string[];
}

const PaymentMethods = ({ amount, eventId, seatIds }: Props) => {
  return (
    <div className="bg-[#12121e] rounded-2xl border border-white/10 overflow-hidden">
      <div className="bg-white/5 px-6 py-4 border-b border-white/10">
        <h3 className="text-white font-medium">Phương thức thanh toán</h3>
      </div>
      
      <div className="p-6">
        {/* Truyền seatIds xuống UI của ngân hàng */}
        <BankTransferUI amount={amount} eventId={eventId} seatIds={seatIds} />
      </div>
    </div>
  );
};

export default PaymentMethods;