"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SalesPoint = {
  day: string;
  tickets: number;
  revenue: number;
};

type Props = {
  data: SalesPoint[];
};

const SalesChart = ({ data }: Props) => {
  return (
    <div className="lg:col-span-3 bg-[#12121e] border border-white/8 rounded-2xl p-5">
      <h3 className="text-white mb-1">Vé đã bán trong 7 ngày qua</h3>
      <p className="text-gray-500 text-xs mb-4">Số lượng vé bán ra mỗi ngày</p>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />

          <XAxis
            dataKey="day"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#fff",
            }}
            labelStyle={{ color: "#f97316" }}
          />

          <Line
            type="monotone"
            dataKey="tickets"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: "#f97316", r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
