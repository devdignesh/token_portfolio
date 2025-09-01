import {
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
  lazy,
  Suspense,
  useCallback,
} from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../store/store";
import type { Token } from "../types";
import {
  fetchWatchlistTokens,
  removeToken,
  updateHoldings,
} from "../store/slice/watchlistSlice";
import { RefreshIcon } from "../assets/RefreshIcon";
import { AddIcon } from "../assets/AddIcon";
import { EditIcon } from "../assets/EditIcon";
import { DeleteIcon } from "../assets/DeleteIcon";
import Pagination from "./Pagination";
import { StarIcon } from "../assets/StarIcon";
import { RowMenuIcon } from "../assets/RowMenuIcon";

// lazy load heavy components
const AddTokenModal = lazy(() => import("./modals/AddTokenModal"));
const TokenSparkline = lazy(() => import("./TokenSparkline"));

interface WatchlistTableProps {
  tokens: Token[];
  holdings: { [key: string]: number };
}

interface HoldingsForm {
  amount: number;
}

const WatchlistTable = memo(({ tokens, holdings }: WatchlistTableProps) => {
  const dispatch = useAppDispatch();
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<HoldingsForm>();
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addtokenRef = useRef<HTMLDivElement>(null);

  // memoized constants
  const tokensPerPage = useMemo(() => 10, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    const handleAddTokenModalClickOutside = (event: MouseEvent) => {
      if (
        addtokenRef.current &&
        !addtokenRef.current.contains(event.target as Node) &&
        isModalOpen
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("click", handleAddTokenModalClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("click", handleAddTokenModalClickOutside);
    };
  }, [isModalOpen]);

  // memoized callbacks
  const onSubmit = useCallback(
    (data: HoldingsForm, tokenId: string) => {
      dispatch(updateHoldings({ id: tokenId, amount: data.amount }));
      setEditingToken(null);
      reset();
    },
    [dispatch, reset]
  );

  const handleRefresh = useCallback(() => {
    if (tokens.length > 0) {
      dispatch(fetchWatchlistTokens(tokens.map((token) => token.id)));
    }
  }, [dispatch, tokens]);

  const handleRowMenuClick = useCallback((tokenId: string) => {
    setOpenDropdown((prev) => (prev === tokenId ? null : tokenId));
  }, []);

  const handleEditClick = useCallback((tokenId: string) => {
    setEditingToken(tokenId);
    setOpenDropdown(null);
  }, []);

  const handleRemoveClick = useCallback(
    (tokenId: string) => {
      dispatch(removeToken(tokenId));
      setOpenDropdown(null);
    },
    [dispatch]
  );

  // memoized calculations
  const paginationData = useMemo(() => {
    const indexOfLastToken = currentPage * tokensPerPage;
    const indexOfFirstToken = indexOfLastToken - tokensPerPage;
    const currentTokens = tokens.slice(indexOfFirstToken, indexOfLastToken);
    const totalPages = Math.ceil(tokens.length / tokensPerPage);

    return {
      indexOfFirstToken,
      indexOfLastToken,
      currentTokens,
      totalPages,
    };
  }, [currentPage, tokensPerPage, tokens]);

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-4 px-5 sm:px-0">
        <div className="flex space-x-1 items-center">
          <StarIcon height={28} width={28} />
          <h2 className="text-lg sm:text-2xl font-medium">Watchlist</h2>
        </div>
        <div className="space-x-2 flex">
          <button
            onClick={handleRefresh}
            className="py-2 px-3 sm:space-x-1.5 flex items-center justify-center bg-[#27272A] rounded-md hover:bg-[#303035] border border-black/20 cursor-pointer"
          >
            <RefreshIcon />
            <span className="text-sm hidden sm:block font-medium text-[#F4F4F5]">
              Refresh Prices
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="py-2 px-3 space-x-1.5 bg-[#A9E851] hover:bg-[#8cc63f] border border-[#1F6619] rounded-md text-black font-medium flex items-center cursor-pointer"
          >
            <AddIcon />
            <span className="text-sm font-medium text-nowrap text-neutral-950">
              Add Token
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-[#212124] rounded-xl border border-white/8 ml-5 sm:ml-0">
        <table className="w-full text-left overflow-x-auto overflow-scroll">
          <thead className="h-12">
            <tr className="border-b border-white/8 bg-[#27272A]">
              <th className="py-4 px-6 text-sm font-medium text-[#A1A1AA]">
                Token
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#A1A1AA]">
                Price
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#A1A1AA]">
                24h %
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#A1A1AA]">
                Sparkline (7d)
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#A1A1AA]">
                Holdings
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#A1A1AA]">
                Value
              </th>
              <th className="py-4 px-6 text-sm font-medium text-[#A1A1AA]"></th>
            </tr>
          </thead>
          <tbody>
            {paginationData.currentTokens.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center h-10 justify-center items-center "
                >
                  <p className="text-sm text-[#A1A1AA] ">
                    No tokens in watchlist
                  </p>
                </td>
              </tr>
            )}
            {paginationData.currentTokens.map((token) => (
              <tr key={token.id} className="h-12">
                <td className="px-6">
                  <div className="flex items-center text-nowrap">
                    <img
                      src={token.image}
                      alt={token.name}
                      className="w-8 h-8 mr-3 rounded-sm"
                    />

                    <span className="text-[#F4F4F5] font-normal text-[13px] mr-1">
                      {token.name}
                    </span>
                    <span className="text-[#A1A1AA] font-normal text-[13px]">
                      ({token.symbol.toUpperCase()})
                    </span>
                  </div>
                </td>
                <td className="px-6">
                  <span className="text-[#A1A1AA] font-normal text-[13px]">
                    $
                    {token.current_price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-6">
                  <span
                    className={`font-normal text-[13px] ${
                      token.price_change_percentage_24h >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {token.price_change_percentage_24h >= 0 ? "+" : ""}
                    {token.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6">
                  {token.sparkline_in_7d?.price &&
                  token.sparkline_in_7d.price.length > 0 ? (
                    <Suspense
                      fallback={
                        <div className="w-24 h-10 bg-[#2C2C2E] animate-pulse rounded" />
                      }
                    >
                      <TokenSparkline
                        sparklineData={token.sparkline_in_7d.price}
                        priceChange={token.price_change_percentage_24h}
                      />
                    </Suspense>
                  ) : (
                    <div className="w-24 h-10 bg-[#2C2C2E] rounded flex items-center justify-center">
                      <span className="text-[#A1A1AA] text-xs">No data</span>
                    </div>
                  )}
                </td>
                <td className="px-6 min-w-[220px]">
                  {editingToken === token.id ? (
                    <form
                      onSubmit={handleSubmit((data) =>
                        onSubmit(data, token.id)
                      )}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="number"
                        step="0.0001"
                        defaultValue={holdings[token.id] || 0}
                        {...register("amount", { required: true, min: 0 })}
                        placeholder="Select"
                        className="w-[109px] px-2 h-8 bg-[#2C2C2E] border rounded-md border-[#A9E851] drop-shadow-[#A9E851] text-white text-sm focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1.5 h-8 items-center flex cursor-pointer rounded-md bg-[#A9E851] border border-[#1F6619] text-neutral-950 text-[13px] font-medium transition-colors"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <span className="text-[#F4F4F5] font-normal text-[13px]">
                      {holdings[token.id] || 0}
                    </span>
                  )}
                </td>
                <td className="px-6">
                  <span className="text-[#F4F4F5] font-normal text-[13px]">
                    $
                    {(
                      (holdings[token.id] || 0) * token.current_price
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-6">
                  <div className="flex items-center justify-center relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowMenuClick(token.id);
                      }}
                      className="hover:bg-[#27272A] cursor-pointer rounded-md  h-7 w-7 items-center text-center flex"
                    >
                      <RowMenuIcon />
                    </button>

                    {openDropdown === token.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute lg:right-12 lg:-top-4 right-2 -top-16 shadow-lg z-50 w-[144px] h-[72px]
             bg-[#27272A] rounded-lg border border-black/20 flex flex-col justify-center pointer-events-auto px-1"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <button
                          onClick={() => handleEditClick(token.id)}
                          className="w-full flex items-center gap-2 px-2 py-1 h-7 cursor-pointer rounded-sm hover:bg-[#3F3F46] transition-colors text-left font-medium text-[#A1A1AA]  text-[13px] whitespace-nowrap"
                        >
                          <EditIcon />
                          Edit Holdings
                        </button>

                        <div className="w-full h-px bg-[#3F3F46] my-1"></div>

                        <button
                          onClick={() => handleRemoveClick(token.id)}
                          className="w-full flex items-center gap-3 px-2 py-1 h-7 rounded-sm cursor-pointer transition-colors hover:bg-[#3F3F46]  font-medium text-left text-[#FDA4AF] text-[13px] whitespace-nowrap"
                        >
                          <DeleteIcon />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/8">
              <td colSpan={7}>
                <div className="flex flex-row justify-between items-center w-full h-[60px] p-4 ">
                  <div className="w-full h-7 flex rounded-md py-1 px-2 space-x-1 text-[#A1A1AA]">
                    <span className="text-[13px] font-medium ">
                      {paginationData.indexOfFirstToken + 1}-
                      {Math.min(paginationData.indexOfLastToken, tokens.length)}{" "}
                      of {tokens.length}
                    </span>
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={paginationData.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Suspense fallback={null}>
        <AddTokenModal
          ref={addtokenRef}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Suspense>
    </div>
  );
});

WatchlistTable.displayName = "WatchlistTable";

export default WatchlistTable;
