import axios from "axios";
import type { Token } from "../types";

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
});

export const fetchTokens = async (
  page: number = 1,
  perPage: number = 10,
  ids: string = ""
): Promise<Token[]> => {
  try {
    const response = await api.get("/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: perPage,
        page,
        sparkline: true,
        price_change_percentage: "24h",
        ids,
        x_cg_demo_api_key: process.env.REACT_APP_CG_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tokens:", error);
    throw error;
  }
};

export const fetchAllTokens = async (): Promise<
  { id: string; name: string; symbol: string }[]
> => {
  try {
    const response = await api.get("/coins/list", {
      params: {
        x_cg_demo_api_key: process.env.REACT_APP_CG_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all tokens:", error);
    throw error;
  }
};

export const fetchSearchTokens = async (query: string): Promise<string[]> => {
  try {
    const response = await api.get("/search", {
      params: {
        query,
        x_cg_demo_api_key: process.env.REACT_APP_CG_API_KEY,
      },
    });
    return response.data.coins.map((coin: any) => coin.id);
  } catch (error) {
    console.error("Error searching tokens:", error);
    throw error;
  }
};

export const fetchTrendingTokens = async (): Promise<Token[]> => {
  try {
    const response = await api.get("/search/trending", {
      params: {
        x_cg_demo_api_key: process.env.REACT_APP_CG_API_KEY,
      },
    });
    return response.data.coins.map((coin: any) => coin.item);
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    throw error;
  }
};
