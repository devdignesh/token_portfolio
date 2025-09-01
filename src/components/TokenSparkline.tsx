import { memo } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface TokenSparklineProps {
  sparklineData: number[];
  priceChange: number;
}

const TokenSparkline = memo(
  ({ sparklineData, priceChange }: TokenSparklineProps) => {
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
  }
);

TokenSparkline.displayName = "TokenSparkline";

export default TokenSparkline;
