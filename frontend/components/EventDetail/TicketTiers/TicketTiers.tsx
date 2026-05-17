type TicketTier = {
  id: string | number;
  name: string;
  price: number;
};

type TicketTiersProps = {
  tiers: TicketTier[];
};

const TicketTiers = ({ tiers }: TicketTiersProps) => {
  // Nếu chưa có hạng vé nào thì không hiển thị khối này để tránh giao diện bị trống
  if (!tiers || tiers.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-white text-lg font-semibold mb-4">Các hạng vé</h2>

      <div className="flex flex-col gap-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="bg-[#12121e] border border-white/10 rounded-xl p-4 flex justify-between items-center hover:border-orange-500/50 transition-colors"
          >
            <span className="text-white font-medium">{tier.name}</span>
            <span className="text-orange-500 font-bold text-lg">
              {Number(tier.price).toLocaleString('vi-VN')}đ
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketTiers;