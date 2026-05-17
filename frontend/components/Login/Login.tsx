"use client";

import { motion } from "motion/react";
import LoginBrandPanel from "./LoginBrandPanel/LoginBrandPanel";
import MobileLogo from "./MobileLogo/MobileLogo";
import SocialLoginButtons from "./SocialLoginButtons/SocialLoginButtons";
import AuthDivider from "./AuthDivider/AuthDivider";
import LoginForm from "./LoginForm/LoginForm";
import AuthTerms from "./AuthTerms/AuthTerms";

const Login = () => {
  return (
    <main className="min-h-screen bg-[#06060f] flex">
      <LoginBrandPanel />

      <section className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <MobileLogo />

          <h2 className="text-white mb-1">Đăng nhập</h2>

          <p className="text-gray-400 text-sm mb-8">
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              Đăng ký miễn phí
            </a>
          </p>

          <SocialLoginButtons />
          <AuthDivider />
          <LoginForm />
          <AuthTerms />
        </motion.div>
      </section>
    </main>
  );
};

export default Login;
