"use client";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenueItem = {
  name: string;
  revenue: number;
};

type Props = {
  data: RevenueItem[];
};

const RevenueChart = ({ data }: Props) => {
  if (data.length === 0) return null;

  return (
    <div className="bg-[#12121e] border border-white/8 rounded-2xl p-5 mb-8">
      <h3 className="text-white mb-1">Doanh thu theo sự kiện</h3>
      <p className="text-gray-500 text-xs mb-4">Tổng doanh thu mỗi sự kiện</p>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />

          <Tooltip
            contentStyle={{
              background: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value) => `$${value}`}
          />

          <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
