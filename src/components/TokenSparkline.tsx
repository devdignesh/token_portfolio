import { memo } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface TokenSparklineProps {
  sparklineData: number[];
  priceChange: number;
}

const TokenSparkline = memo(
  ({ sparklineData, priceChange }: TokenSparklineProps) => {
    // validate data before rendering
    if (!sparklineData || sparklineData.length === 0) {
      return (
        <div className="w-24 h-10 bg-[#2C2C2E] rounded flex items-center justify-center">
          <span className="text-[#A1A1AA] text-xs">No data</span>
        </div>
      );
    }

    try {
      const chartData = sparklineData.map((price) => ({ price }));
      const strokeColor = priceChange >= 0 ? "#10B981" : "#EF4444";

      return (
        <div className="w-24 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    } catch {
      // fallback for any chart rendering errors
      return (
        <div className="w-24 h-10 bg-[#2C2C2E] rounded flex items-center justify-center">
          <span className="text-[#A1A1AA] text-xs">Error</span>
        </div>
      );
    }
  }
);

TokenSparkline.displayName = "TokenSparkline";

export default TokenSparkline;
