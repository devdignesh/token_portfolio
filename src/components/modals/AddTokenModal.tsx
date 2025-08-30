import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  fetchSearchTokens,
  fetchTokens,
  fetchTrendingTokens,
} from "../../services/api";
import { addTokens } from "../../store/slice/watchlistSlice";
import useDebounce from "../../hooks/useDebounce";
import TokenList from "../TokenList";
import { filterTokens } from "../../utils/tokenUtils";

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TokenOption {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
}

function AddTokenModal({ isOpen, onClose }: AddTokenModalProps) {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
  const [tokens, setTokens] = useState<TokenOption[]>([]);
  const [trendingTokens, setTrendingTokens] = useState<TokenOption[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { tokens: watchlistTokens } = useAppSelector(
    (state) => state.watchlist
  );
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([fetchTokens(page, 50), fetchTrendingTokens()])
        .then(([marketTokens, trending]) => {
          setTokens(marketTokens);
          setTrendingTokens(
            trending.map((t) => ({
              id: t.id,
              name: t.name,
              symbol: t.symbol,
              image: (t as any).thumb || "",
              current_price: (t as any).data?.price || 0,
              price_change_percentage_24h:
                (t as any).data?.price_change_percentage_24h?.usd || 0,
              sparkline_in_7d: { price: [] },
            }))
          );
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load tokens");
          setLoading(false);
        });
      loadTokens(debouncedSearchQuery, 1);
    }
  }, [isOpen, debouncedSearchQuery]);

  const loadTokens = async (query: string, currentPage: number) => {
    try {
      setLoading(true);
      let newTokens: TokenOption[] = [];
      if (query) {
        const searchedIds = await fetchSearchTokens(query);
        if (searchedIds.length > 0) {
          newTokens = await fetchTokens(1, 250, searchedIds.join(","));
        }
      } else {
        newTokens = await fetchTokens(currentPage, 50);
      }
      setTokens((prev) =>
        query || currentPage === 1 ? newTokens : [...prev, ...newTokens]
      );
    } catch (err) {
      setError("Failed to load tokens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery) {
      setPage(1);
    }
  }, [debouncedSearchQuery]);

  const filteredTokens = useMemo(
    () =>
      filterTokens(tokens, debouncedSearchQuery).filter(
        (token) => !watchlistTokens.some((wt) => wt.id === token.id)
      ),
    [tokens, debouncedSearchQuery, watchlistTokens]
  );

  const filteredTrendingTokens = useMemo(
    () =>
      filterTokens(trendingTokens, debouncedSearchQuery).filter(
        (token) => !watchlistTokens.some((wt) => wt.id === token.id)
      ),
    [trendingTokens, debouncedSearchQuery, watchlistTokens]
  );

  const handleToggleToken = (tokenId: string) => {
    setSelectedTokenIds((prev) =>
      prev.includes(tokenId)
        ? prev.filter((id) => id !== tokenId)
        : [...prev, tokenId]
    );
  };

  const handleAddTokens = () => {
    if (selectedTokenIds.length > 0) {
      const tokensToAdd = [
        ...trendingTokens.filter((t) => selectedTokenIds.includes(t.id)),
        ...tokens.filter((t) => selectedTokenIds.includes(t.id)),
      ];
      dispatch(addTokens(tokensToAdd));
      setSelectedTokenIds([]);
      setSearchQuery("");
      onClose();
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadTokens(debouncedSearchQuery, nextPage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-500 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Token</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tokens..."
          className="w-full p-2 border rounded mb-4"
        />
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="max-h-64 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Trending</h3>
          <TokenList
            tokens={filteredTrendingTokens}
            selectedTokenIds={selectedTokenIds}
            onToggleToken={handleToggleToken}
          />
          <h3 className="text-lg font-semibold my-2">All Tokens</h3>
          {filteredTokens.length === 0 && !loading && (
            <p className="text-center text-gray-500">No tokens found</p>
          )}
          <TokenList
            tokens={filteredTokens}
            selectedTokenIds={selectedTokenIds}
            onToggleToken={handleToggleToken}
          />
          {!debouncedSearchQuery && !loading && filteredTokens.length > 0 && (
            <button
              onClick={handleLoadMore}
              className="w-full py-2 mt-2 text-blue-500 hover:text-blue-600"
            >
              Load More
            </button>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTokens}
            disabled={selectedTokenIds.length === 0}
            className={`px-4 py-2 rounded ${
              selectedTokenIds.length > 0
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTokenModal;
