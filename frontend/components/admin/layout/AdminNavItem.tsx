"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

type Props = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  exact?: boolean;
  onClick?: () => void;
};

const AdminNavItem = ({
  href,
  icon: Icon,
  label,
  exact = false,
  onClick,
}: Props) => {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active
          ? "bg-gradient-to-r from-orange-500/20 to-red-600/10 text-orange-400 border border-orange-500/20"
          : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </Link>
  );
};

export default AdminNavItem;
