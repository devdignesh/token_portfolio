interface Token {
  id: string;
  name: string;
  symbol: string;
  image?: string;
}

export function filterTokens(tokens: Token[], query: string): Token[] {
  if (!query) return tokens;
  return tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(query.toLowerCase()) ||
      token.symbol.toLowerCase().includes(query.toLowerCase())
  );
}
