"use client";

import { useGoogleLogin } from "@react-oauth/google";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const normalizeToken = (rawToken: unknown) => {
  if (!rawToken || typeof rawToken !== "string") return "";

  let token = rawToken.trim();

  while (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }

  token = token.replace(/^"+|"+$/g, "").trim();

  if (token.split(".").length !== 3) return "";

  return token;
};

const saveLoginSession = (data: any) => {
  const token = normalizeToken(data?.token);
  const user = data?.data?.user || data?.user || data?.data || {};

  if (!token) {
    throw new Error("Backend không trả token hợp lệ");
  }

  localStorage.setItem("token", token);
  localStorage.setItem("userName", user.name || "");
  localStorage.setItem("userRole", user.role || "user");
  localStorage.setItem("tr_user", JSON.stringify(user));

  if (user.role === "admin") {
    localStorage.setItem("tr_admin_token", token);
    localStorage.setItem("tr_admin_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("tr_admin_token");
    localStorage.removeItem("tr_admin_user");
  }

  return user;
};

const SocialLoginButtons = () => {
  const login = useGoogleLogin({
    flow: "implicit",

    onSuccess: async (tokenResponse) => {
      try {
        const profileResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        if (!profileResponse.ok) {
          throw new Error("Không lấy được thông tin Google profile");
        }

        const profile = await profileResponse.json();

        const response = await fetch(`${API_BASE}/user/social-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
            provider: "google",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Đăng nhập Google thất bại");
        }

        const user = saveLoginSession(data);

        if (user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } catch (err) {
        console.error("Google login error:", err);

        alert(
          err instanceof Error
            ? err.message
            : "Đăng nhập Google thất bại"
        );
      }
    },

    onError: () => {
      alert("Google login failed");
    },
  });

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => login()}
        className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white text-sm hover:bg-white/10 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>

        Tiếp tục với Google
      </button>
    </div>
  );
};

export default SocialLoginButtons;