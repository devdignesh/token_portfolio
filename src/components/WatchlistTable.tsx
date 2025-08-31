import { useState } from "react";
import { useForm } from "react-hook-form";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useAppDispatch } from "../store/store";
import type { Token } from "../types";
import { removeToken, updateHoldings } from "../store/slice/watchlistSlice";
import { RefreshIcon } from "../assets/RefreshIcon";
import { AddIcon } from "../assets/AddIcon";
import { EditIcon } from "../assets/EditIcon";
import { DeleteIcon } from "../assets/DeleteIcon";
import AddTokenModal from "./modals/AddTokenModal";
import Pagination from "./Pagination";

interface WatchlistTableProps {
  tokens: Token[];
  holdings: { [key: string]: number };
}

interface HoldingsForm {
  amount: number;
}

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

function WatchlistTable({ tokens, holdings }: WatchlistTableProps) {
  const dispatch = useAppDispatch();
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<HoldingsForm>();
  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 10;

  const onSubmit = (data: HoldingsForm, tokenId: string) => {
    dispatch(updateHoldings({ id: tokenId, amount: data.amount }));
    setEditingToken(null);
    reset();
  };

  // Calculate paginated tokens
  const indexOfLastToken = currentPage * tokensPerPage;
  const indexOfFirstToken = indexOfLastToken - tokensPerPage;
  const currentTokens = tokens.slice(indexOfFirstToken, indexOfLastToken);
  const totalPages = Math.ceil(tokens.length / tokensPerPage);

  return (
    <div className="  shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Watchlist</h2>
        <div className="space-x-2">
          <button className="text-blue-500 hover:text-blue-600">
            <RefreshIcon />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-500 hover:text-blue-600"
          >
            <AddIcon />
          </button>
        </div>
      </div>
      {currentTokens.length === 0 ? (
        <p className="text-center text-gray-500">No tokens in watchlist</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Token</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">24h %</th>
                <th className="py-2 px-4">Sparkline (7d)</th>
                <th className="py-2 px-4">Holdings</th>
                <th className="py-2 px-4">Value</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {currentTokens.map((token, index) => (
                <tr key={token.id} className="border-b">
                  <td className="py-2 px-4 flex items-center">
                    <img
                      src={token.image}
                      alt={token.name}
                      className="w-6 h-6 mr-2"
                    />
                    {token.name} ({token.symbol.toUpperCase()})
                  </td>
                  <td className="py-2 px-4">
                    ${token.current_price.toFixed(2)}
                  </td>
                  <td
                    className={`py-2 px-4 ${
                      token.price_change_percentage_24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {token.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="py-2 px-4">
                    <ResponsiveContainer width={100} height={40}>
                      <LineChart
                        data={token.sparkline_in_7d.price.map((price) => ({
                          price,
                        }))}
                      >
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={COLORS[index % COLORS.length]}
                          dot={false}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </td>
                  <td className="py-2 px-4">
                    {editingToken === token.id ? (
                      <form
                        onSubmit={handleSubmit((data) =>
                          onSubmit(data, token.id)
                        )}
                      >
                        <input
                          type="number"
                          step="0.0001"
                          defaultValue={holdings[token.id] || 0}
                          {...register("amount", { required: true, min: 0 })}
                          className="w-24 p-1 border rounded"
                        />
                        <button
                          type="submit"
                          className="ml-2 text-blue-500 hover:text-blue-600"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <span>{holdings[token.id] || 0}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    $
                    {((holdings[token.id] || 0) * token.current_price).toFixed(
                      2
                    )}
                  </td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => setEditingToken(token.id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => dispatch(removeToken(token.id))}
                      className="text-red-500 hover:text-red-600"
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
      <AddTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default WatchlistTable;
