import { Calendar, CreditCard } from "lucide-react";
import type { CheckoutForm } from "../Checkout";

type Props = {
  form: CheckoutForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const INPUT_CLASS =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-orange-500/50 focus:bg-white/8 transition-colors";

const PaymentForm = ({ form, onChange }: Props) => {
  return (
    <section className="bg-[#12121e] border border-white/8 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white">Payment Details</h3>

        <div className="flex gap-2">
          {["VISA", "MC", "AMEX"].map((card) => (
            <span
              key={card}
              className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded"
            >
              {card}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">
            Card Number
          </label>

          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

            <input
              name="cardNumber"
              value={form.cardNumber}
              onChange={onChange}
              placeholder="1234 5678 9012 3456"
              className={`${INPUT_CLASS} pl-11`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">
              Expiry
            </label>

            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

              <input
                name="expiry"
                value={form.expiry}
                onChange={onChange}
                placeholder="MM/YY"
                className={`${INPUT_CLASS} pl-11`}
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">CVV</label>

            <input
              name="cvv"
              value={form.cvv}
              onChange={onChange}
              placeholder="•••"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">
            Name on Card
          </label>

          <input
            name="nameOnCard"
            value={form.nameOnCard}
            onChange={onChange}
            placeholder="John Doe"
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </section>
  );
};

export default PaymentForm;
