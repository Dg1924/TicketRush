"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { EVENTS, type Event, type TicketTier } from "@/data/events";
import { useApp } from "@/store/AppContext";
import CheckoutHeader from "./CheckoutHeader/CheckoutHeader";
import ContactForm from "./ContactForm/ContactForm";
import PaymentForm from "./PaymentForm/PaymentForm";
import TermsCheckbox from "./TermsCheckbox/TermsCheckbox";
import SubmitButton from "./SubmitButton/SubmitButton";
import OrderSummary from "./OrderSummary/OrderSummary";

export interface CheckoutState {
  event: Event;
  tier: TicketTier;
  quantity: number;
  total: number;
  seatIds?: string[];
}

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}

const Checkout = () => {
  const router = useRouter();
  const { user } = useApp();

  const event = EVENTS[0];
  const tier = event.tiers[0];
  const quantity = 1;
  const serviceFee = 8;
  const total = tier.price * quantity + serviceFee;
  const seatIds: string[] = [];

  const [form, setForm] = useState<CheckoutForm>({
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
    email: user?.email ?? "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (e.target.name === "cardNumber") {
      value = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }

    if (e.target.name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);

      if (value.length > 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
    }

    if (e.target.name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    setForm((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const isValid =
    Boolean(form.firstName) &&
    Boolean(form.lastName) &&
    form.email.includes("@") &&
    form.cardNumber.replace(/\s/g, "").length === 16 &&
    form.expiry.length === 5 &&
    form.cvv.length >= 3 &&
    Boolean(form.nameOnCard) &&
    agreed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    setLoading(true);

    setTimeout(() => {
      router.push("/payment");
    }, 600);
  };

  return (
    <main className="min-h-screen bg-[#08080f] pt-16 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <CheckoutHeader />

        <div className="grid md:grid-cols-5 gap-6">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="md:col-span-3 flex flex-col gap-6"
          >
            <ContactForm form={form} onChange={handleChange} />
            <PaymentForm form={form} onChange={handleChange} />
            <TermsCheckbox agreed={agreed} onChange={setAgreed} />
            <SubmitButton isValid={isValid} loading={loading} />
          </motion.form>

          <OrderSummary
            event={event}
            tier={tier}
            quantity={quantity}
            total={total}
            seatIds={seatIds}
          />
        </div>
      </div>
    </main>
  );
};

export default Checkout;
