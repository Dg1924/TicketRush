interface BankTransferUIProps {
  amount: number;
  eventId: string | number;
  seatIds: string[];
}

const BankTransferUI = ({ amount, eventId, seatIds }: BankTransferUIProps) => {
  const BANK_ID = "BIDV"; 
  const ACCOUNT_NO = "0988198712"; 
  const ACCOUNT_NAME = "NGHIEM DINH DUONG"; 

  let seatString = "";
  if (seatIds && seatIds.length > 0) {
    const shortSeats = seatIds.map(id => {
      const parts = id.split("_"); 
      if (parts.length >= 3) return `${parts[1]}${parts[2]}`;
      return id;
    });
    seatString = "_" + shortSeats.join("_");
  }

  let transferContent = `muave_ev${eventId}${seatString}`;
  if (transferContent.length > 40) {
    transferContent = transferContent.substring(0, 40); 
  }
  
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white p-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] w-48 h-48 flex items-center justify-center">
        {amount > 0 ? (
          <img 
            src={qrUrl} 
            alt="QR Thanh toán" 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      <div className="text-center space-y-4 w-full max-w-sm">
        <p className="text-white font-medium text-lg">
          Quét mã QR bằng ứng dụng ngân hàng
        </p>

        <div className="bg-[#08080f] rounded-xl p-5 text-left border border-white/10 space-y-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-gray-400 text-sm">Ngân hàng:</span>
            <span className="text-white font-medium">BIDV</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-gray-400 text-sm">Số tài khoản:</span>
            <span className="text-orange-400 font-mono text-lg font-bold tracking-wider">
              {ACCOUNT_NO}
            </span>
          </div>
          
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-gray-400 text-sm">Số tiền:</span>
            <span className="text-white font-medium">
              {Number(amount).toLocaleString('vi-VN')}đ
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Nội dung:</span>
            <span className="text-white font-medium break-all">{transferContent}</span>
          </div>
        </div>
        
        <p className="text-orange-400/80 text-xs italic">
          * Vui lòng giữ nguyên số tiền và nội dung chuyển khoản để hệ thống duyệt vé tự động.
        </p>
      </div>
    </div>
  );
};

export default BankTransferUI;