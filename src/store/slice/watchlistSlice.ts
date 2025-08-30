import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { Token, WatchlistState } from "../../types";

const loadFromLocalStorage = (): WatchlistState => {
  try {
    const serializedState = localStorage.getItem("watchlist");
    if (serializedState === null) {
      return { tokens: [], holdings: {}, loading: false, error: null };
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Error loading from localStorage:", e);
    return { tokens: [], holdings: {}, loading: false, error: null };
  }
};

const initialState: WatchlistState = loadFromLocalStorage();

export const fetchWatchlistTokens = createAsyncThunk(
  "watchlist/fetchWatchlistTokens",
  async (ids: string[], { rejectWithValue }) => {
    try {
      if (ids.length === 0) {
        return [];
      }
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            ids: ids.join(","),
            sparkline: true,
            price_change_percentage: "24h",
            x_cg_demo_api_key: process.env.REACT_APP_CG_API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch watchlist tokens");
    }
  }
);

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToken: (state, action: PayloadAction<Token>) => {
      if (!state.tokens.find((token) => token.id === action.payload.id)) {
        state.tokens.push(action.payload);
        state.holdings[action.payload.id] = 0;
        localStorage.setItem("watchlist", JSON.stringify(state));
      }
    },
    addTokens: (state, action: PayloadAction<Token[]>) => {
      action.payload.forEach((newToken) => {
        if (!state.tokens.find((token) => token.id === newToken.id)) {
          state.tokens.push(newToken);
          state.holdings[newToken.id] = 0;
        }
      });
      localStorage.setItem("watchlist", JSON.stringify(state));
    },
    removeToken: (state, action: PayloadAction<string>) => {
      state.tokens = state.tokens.filter(
        (token) => token.id !== action.payload
      );
      delete state.holdings[action.payload];
      localStorage.setItem("watchlist", JSON.stringify(state));
    },
    updateHoldings: (
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      state.holdings[action.payload.id] = action.payload.amount;
      localStorage.setItem("watchlist", JSON.stringify(state));
    },
    updateTokenData: (state, action: PayloadAction<Token[]>) => {
      state.tokens = action.payload.map((newToken) => {
        const existingToken = state.tokens.find(
          (token) => token.id === newToken.id
        );
        return existingToken
          ? { ...newToken, holdings: state.holdings[newToken.id] || 0 }
          : newToken;
      });
      localStorage.setItem("watchlist", JSON.stringify(state));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlistTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWatchlistTokens.fulfilled,
        (state, action: PayloadAction<Token[]>) => {
          state.loading = false;
          state.tokens = action.payload.map((newToken) => ({
            ...newToken,
            holdings: state.holdings[newToken.id] || 0,
          }));
          localStorage.setItem("watchlist", JSON.stringify(state));
        }
      )
      .addCase(fetchWatchlistTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addToken,
  addTokens,
  removeToken,
  updateHoldings,
  updateTokenData,
} = watchlistSlice.actions;
export default watchlistSlice.reducer;
