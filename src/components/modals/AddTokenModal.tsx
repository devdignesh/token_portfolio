import { useState, useEffect, useMemo, forwardRef } from "react";
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
  ref?: React.RefObject<HTMLDivElement>
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

const AddTokenModal = forwardRef<HTMLDivElement, AddTokenModalProps>(({ isOpen, onClose }, ref) => {
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
          console.log("Error : failed to fetch tokens", err);
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
      console.log("Error : load tokens", err);
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
    <div  className="fixed inset-0 bg-[#212124D9] flex items-center justify-center">
      <div ref={ref} className="bg-[#212124] rounded-xl overflow-hidden max-h-[480px] flex flex-col w-[640px] border border-[#00000052] shadow-xl">
        <div className="w-full py-3 px-4 border-b border-white/8 flex items-center justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens (e.g., ETH, SOL)..."
            className="rounded h-7 w-[608px] text-sm font-normal placeholder:text-[#71717A] text-[#F4F4F5] outline-none focus:outline-none border-0"
          />
        </div>

        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="px-2  overflow-auto ">
          <div className="rounded-md pt-3 px-2 pb-1">
            <span className="text-xs font-medium">Trending</span>
          </div>
          <TokenList
            tokens={filteredTrendingTokens}
            selectedTokenIds={selectedTokenIds}
            onToggleToken={handleToggleToken}
          />
          <div className="rounded-md pt-3 px-2 pb-1">
            <span className="text-xs font-medium">All Tokens</span>
          </div>
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
        <div className="flex py-3 px-4 justify-end h-[57px] bg-[#27272A] border-t border-white/10">
          
          <button
            onClick={handleAddTokens}
            disabled={selectedTokenIds.length === 0}
            className={`h-8  rounded-md py-1.5 px-2.5 border text-[13px] font-medium border-white/10 ${
              selectedTokenIds.length > 0
                ? "bg-[#A9E851] ring-1 ring-[#1F6619] text-neutral-950 hover:bg-blue-600 "
                : "bg-[#27272A] text-[#52525B] cursor-not-allowed "
            }`}
          >
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
});

export default AddTokenModal;
