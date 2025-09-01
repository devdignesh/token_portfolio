import type { Token } from "../types";

export interface PortfolioDataItem {
  name: string;
  symbol: string;
  value: number;
  color: string;
}

const CHART_COLORS = [
  "#10B981",
  "#A78BFA",
  "#60A5FA",
  "#18C9DD",
  "#FB923C",
  "#FB7185",
];

export function getTokenColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

export function prepareChartData(
  tokens: Token[],
  holdings: { [key: string]: number }
): PortfolioDataItem[] {
  return tokens
    .map((token) => ({
      name: token.name,
      symbol: token.symbol,
      value: (holdings[token.id] || 0) * token.current_price,
      color: getTokenColor(tokens.indexOf(token)),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}
