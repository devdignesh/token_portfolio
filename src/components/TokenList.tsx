import { CheckIcon } from "../assets/CheckIcon";
import { StarIcon } from "../assets/StarIcon";
import { UncheckIcon } from "../assets/UncheckIcon";
import RandomLogo from "./RandomLogo";

interface Token {
  id: string;
  name: string;
  symbol: string;
  image?: string;
}

interface TokenListProps {
  tokens: Token[];
  selectedTokenIds: string[];
  onToggleToken: (tokenId: string) => void;
}

function TokenList({
  tokens,
  selectedTokenIds,
  onToggleToken,
}: TokenListProps) {
  return (
    <>
      {tokens.map((token) => (
        <div
          key={token.id}
          onClick={() => onToggleToken(token.id)}
          className={`flex items-center justify-between p-2 my-[1px] h-11 rounded-md cursor-pointer  ${
            selectedTokenIds.includes(token.id)
              ? "bg-[#A9E8510F] "
              : "hover:bg-[#27272A]"
          }`}
        >
          <div className="flex items-center space-x-3">
            {token.image ? (
              <img
                src={token.image}
                alt={token.name}
                className="w-7 h-7 rounded-md p-0.5"
              />
            ) : (
              <RandomLogo width={40} height={40} />
            )}
            <span className="text-[#F4F4F5] font-normal text-sm">
              {token.name} ({token.symbol.toUpperCase()})
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {selectedTokenIds.includes(token.id) && (
              <StarIcon height={17} width={17} />
            )}
            <button
              onClick={() => onToggleToken(token.id)}
              className="cursor-pointer"
            >
              {selectedTokenIds.includes(token.id) ? (
                <UncheckIcon />
              ) : (
                <CheckIcon />
              )}
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default TokenList;
