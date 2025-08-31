import { useEffect, useRef } from "react";
import PortfolioTotal from "./PortfolioTotal";
import WatchlistTable from "./WatchlistTable";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchWatchlistTokens } from "../store/slice/watchlistSlice";

function Portfolio() {
  const dispatch = useAppDispatch();
  const { tokens, holdings, loading, error } = useAppSelector(
    (state) => state.watchlist
  );
  const hasFetched = useRef(false);

  useEffect(() => {
    if (tokens.length > 0 && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchWatchlistTokens(tokens.map((token) => token.id)));
    }
    // refresh data every 60 seconds
    const interval = setInterval(() => {
      if (tokens.length > 0) {
        dispatch(fetchWatchlistTokens(tokens.map((token) => token.id)));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch, tokens]);

  return (
    <div className="space-y-6">
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <PortfolioTotal tokens={tokens} holdings={holdings} />
      <WatchlistTable tokens={tokens} holdings={holdings} />
    </div>
  );
}

export default Portfolio;
