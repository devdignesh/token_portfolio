# Token portfolio
A simple app to track your favorite cryptocurrencies, view their prices, and manage a portfolio with a clean UI.

## Tech Stack
- React + Vite
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Wallet (wagmi + RainbowKit)
- CoinGecko API
  

## How to Install
```bash
git clone https://github.com/devdignesh/token_portfolio.git
cd token_portfolio
npm install
npm run dev
```
## Features

- Add/remove tokens to watchlist
- Real-time price updates every 60 seconds
- Portfolio value with custom SVG donut chart
- Paginated watchlist table (10 tokens/page)
- Search tokens with debounced input
- Filter out existing watchlist tokens
- Pixel perfect & responsive ui

## Optimization Solutions

- Code Splitting & Lazy Loading: Lazy-loaded AddTokenModal and TokenSparkline to reduce bundle size.
- React Performance: Used React.memo, useCallback, and useMemo to prevent re-renders and optimize calculations.
- Infinite Scroll: Auto-fetch next page of tokens when scrolling to bottom in AddTokenModal.
- Bundle Size: Manual chunking in Vite config, separated vendor libraries (React, Recharts, etc.), and removed unused imports.
- Build Config: Increased Vite chunk size limit to 1000kb for efficient splitting.
