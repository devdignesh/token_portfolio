import {
  useEffect,
  useRef,
  useState,
  useMemo,
  lazy,
  Suspense,
  useCallback,
} from "react";
import { useAppDispatch } from "../store/store";
import type { Token } from "../types";
import { fetchWatchlistTokens } from "../store/slice/watchlistSlice";
import { RefreshIcon } from "../assets/RefreshIcon";
import { AddIcon } from "../assets/AddIcon";
import Pagination from "./Pagination";
import { StarIcon } from "../assets/StarIcon";
import WatchlistTableRow from "./WatchlistTableRow";

// lazy load heavy components
const AddTokenModal = lazy(() => import("./modals/AddTokenModal"));

interface WatchlistTableProps {
  tokens: Token[];
  holdings: { [key: string]: number };
}

const WatchlistTable = ({ tokens, holdings }: WatchlistTableProps) => {
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const addtokenRef = useRef<HTMLDivElement>(null);

  const tokensPerPage = 10;

  useEffect(() => {
    const handleAddTokenModalClickOutside = (event: MouseEvent) => {
      if (
        addtokenRef.current &&
        !addtokenRef.current.contains(event.target as Node) &&
        isModalOpen
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("click", handleAddTokenModalClickOutside);
    return () => {
      document.removeEventListener("click", handleAddTokenModalClickOutside);
    };
  }, [isModalOpen]);

  const handleRefresh = useCallback(() => {
    if (tokens.length > 0) {
      dispatch(fetchWatchlistTokens(tokens.map((token) => token.id)));
    }
  }, [dispatch, tokens]);

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
              <WatchlistTableRow token={token} holdings={holdings} />
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
};

WatchlistTable.displayName = "WatchlistTable";

export default WatchlistTable;
