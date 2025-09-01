import { useMemo } from "react";
import type { Token } from "../types";
import { prepareChartData } from "../utils/chartUtils";
import DonutChart from "./charts/DonutChart";

interface PortfolioTotalProps {
  tokens: Token[];
  holdings: { [key: string]: number };
}

function PortfolioTotal({ tokens, holdings }: PortfolioTotalProps) {
  const totalValue = useMemo(() => {
    return tokens.reduce((sum, token) => {
      const holding = holdings[token.id] || 0;
      return sum + holding * token.current_price;
    }, 0);
  }, [tokens, holdings]);

  const chartData = useMemo(
    () => prepareChartData(tokens, holdings),
    [tokens, holdings]
  );

  const lastUpdated = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="bg-[#27272A] grid grid-cols-1 md:grid-cols-2 sm:gap-4 gap-8 p-6 sm:rounded-xl">
      <div className="w-full text-start flex flex-col justify-between h-full space-y-5 md:space-y-0">
        <div className="flex flex-col justify-start space-y-5">
          <span className="text-[#A1A1AA] text-base font-medium">
            Portfolio Total
          </span>
          <h2 className="sm:text-[56px] text-[40px] font-medium tracking-[2.24] leading-[110%] ">
            $
            {totalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>

        <p className="text-xs font-normal text-neutral-400 mt-auto">
          Last updated: {lastUpdated}
        </p>
      </div>
      <div className="w-full flex flex-col gap-5">
        <span className="text-[#A1A1AA] text-base font-medium">
          Portfolio Total
        </span>
        <div className="flex gap-5 flex-col sm:flex-row items-center">
          {chartData.length > 0 ? (
            <DonutChart data={chartData} />
          ) : (
            <p className="text-center text-sm text-[#A1A1AA] text-nowrap">
              No holdings to display
            </p>
          )}

          <div className="w-full flex flex-col">
            {chartData.length > 0 && (
              <ul className="space-y-4">
                {chartData.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <span
                      className="font-medium text-sm"
                      style={{ color: item.color }}
                    >
                      {item.name} ({item.symbol.toUpperCase()})
                    </span>
                    <span className="text-[#A1A1AA] text-sm font-medium">
                      {((item.value / totalValue) * 100).toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioTotal;
