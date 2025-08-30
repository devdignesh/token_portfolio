import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { Token } from "../types";

interface PortfolioTotalProps {
  tokens: Token[];
  holdings: { [key: string]: number };
}

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

function PortfolioTotal({ tokens, holdings }: PortfolioTotalProps) {
  const totalValue = useMemo(() => {
    return tokens.reduce((sum, token) => {
      const holding = holdings[token.id] || 0;
      return sum + holding * token.current_price;
    }, 0);
  }, [tokens, holdings]);

  const chartData = useMemo(() => {
    return tokens
      .map((token) => ({
        name: token.name,
        value: (holdings[token.id] || 0) * token.current_price,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [tokens, holdings]);

  const lastUpdated = new Date().toLocaleString();

  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between">
      <div className="flex flex-col justify-center">
        <h2 className="text-3xl font-bold">${totalValue.toFixed(2)}</h2>
        <p className="text-gray-500">Portfolio Total</p>
        <p className="text-sm text-gray-400 mt-2">
          Last updated: {lastUpdated}
        </p>
      </div>
      <div className="w-full md:w-1/3 mt-4 md:mt-0">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No holdings to display</p>
        )}

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          {chartData.length > 0 ? (
            <ul>
              {chartData.map((item, index) => (
                <li key={item.name} className="flex items-center py-1">
                  <span
                    className="w-4 h-4 mr-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span>
                    {item.name} ({((item.value / totalValue) * 100).toFixed(1)}
                    %)
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tokens to display</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PortfolioTotal;
