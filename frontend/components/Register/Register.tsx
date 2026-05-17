"use client";

import { motion } from "motion/react";
import RegisterBrandPanel from "./RegisterBrandPanel/RegisterBrandPanel";
import RegisterForm from "./RegisterForm/RegisterForm";

const Register = () => {
  return (
    <main className="min-h-screen bg-[#06060f] flex">
      <RegisterBrandPanel />

      <section className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <RegisterForm />
        </motion.div>
      </section>
    </main>
  );
};

export default Register;
