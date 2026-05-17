import type { CheckoutForm } from "../Checkout";

type Props = {
  form: CheckoutForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const INPUT_CLASS =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-orange-500/50 focus:bg-white/8 transition-colors";

const ContactForm = ({ form, onChange }: Props) => {
  return (
    <section className="bg-[#12121e] border border-white/8 rounded-2xl p-5">
      <h3 className="text-white mb-4">Contact Information</h3>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">
            First Name
          </label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            placeholder="John"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">
            Last Name
          </label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            placeholder="Doe"
            className={INPUT_CLASS}
            required
          />
        </div>
      </div>

      <div>
        <label className="text-gray-400 text-xs mb-1.5 block">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="john@example.com"
          className={INPUT_CLASS}
          required
        />
        <p className="text-gray-600 text-xs mt-1.5">
          Tickets will be sent to this email
        </p>
      </div>
    </section>
  );
};

export default ContactForm;
