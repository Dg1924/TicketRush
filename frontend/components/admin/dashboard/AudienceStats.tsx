"use client";

import { Users, UserCircle2 } from "lucide-react";

// Dữ liệu mẫu (Sau này bạn sẽ lấy từ Backend API truyền vào qua Props)
type Props = {
  genderData?: { gender: string; count: number; pct: number }[];
  ageData?: { group: string; count: number; pct: number }[];
  totalAudience?: number;
};

// Mock data tạm thời để bạn xem giao diện (Xóa khi có API)
const MOCK_GENDER = [
  { gender: "Nam", count: 120, pct: 45 },
  { gender: "Nữ", count: 140, pct: 52 },
  { gender: "Khác", count: 8, pct: 3 },
];

const MOCK_AGE = [
  { group: "Dưới 18", count: 40, pct: 15 },
  { group: "18 - 24", count: 120, pct: 45 },
  { group: "25 - 34", count: 80, pct: 30 },
  { group: "Trên 35", count: 28, pct: 10 },
];

const AudienceStats = ({ genderData = MOCK_GENDER, ageData = MOCK_AGE, totalAudience = 268 }: Props) => {
  return (
    <div className="lg:col-span-2 bg-[#12121e] border border-white/8 rounded-2xl p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            Thống kê Khán giả
          </h3>
          <p className="text-gray-500 text-xs mt-1">Độ tuổi & Giới tính</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{totalAudience}</p>
          <p className="text-gray-500 text-[10px] uppercase">Khách hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        {/* CỘT GIỚI TÍNH */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
            Giới tính
          </h4>
          <div className="flex flex-col gap-4">
            {genderData.map((item) => (
              <div key={item.gender}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300 font-medium">{item.gender}</span>
                  <span className="text-gray-400">{item.pct}% ({item.count})</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: item.gender === "Nữ" ? "#ec4899" : item.gender === "Nam" ? "#3b82f6" : "#8b5cf6",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT ĐỘ TUỔI */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
            Độ tuổi phân bổ
          </h4>
          <div className="flex flex-col gap-3">
            {ageData.map((item) => (
              <div key={item.group} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-16">{item.group}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-orange-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-300 w-8 text-right">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceStats;