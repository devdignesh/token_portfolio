import { CheckIcon } from "../assets/CheckIcon";
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
          className="flex items-center justify-between py-2 border-b"
        >
          <div className="flex items-center">
            {token.image ? (
              <img
                src={token.image}
                alt={token.name}
                className="w-6 h-6 mr-2"
              />
            ) : (
              <RandomLogo width={40} height={40} />
            )}
            <span>
              {token.name} ({token.symbol.toUpperCase()})
            </span>
          </div>
          <button onClick={() => onToggleToken(token.id)}>
            {selectedTokenIds.includes(token.id) ? (
              <UncheckIcon />
            ) : (
              <CheckIcon />
            )}
          </button>
        </div>
      ))}
    </>
  );
}

export default TokenList;
