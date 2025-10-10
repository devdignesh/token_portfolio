# Token portfolio
A modern, pixel-perfect crypto portfolio dashboard to track, manage, and visualize your favorite tokens — all in real time.

## Tech Stack
- **Frontend**: React (Vite) + TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Wallet Integration**: wagmi + RainbowKit
- **API**: CoinGecko
- **Charts**: Custom SVG Donut Chart

## Preview
<img width="1440" height="920" alt="dashboard" src="https://github.com/user-attachments/assets/de8bc6e0-ca17-4b24-8ff9-f252762823ab" />

## Features

- **Search 18,000+ cryptocurrencies** using CoinGecko API with intelligent debounce.
- **Add / remove tokens** to your personal watchlist with one click.
- **Real-time price updates** every 60 seconds for accurate portfolio tracking.
- **Custom SVG donut chart** to visualize portfolio distribution dynamically.
- **Paginated & optimized table view** (10 tokens per page).
- **Connect crypto wallet** via wagmi + RainbowKit for real-time token interaction.
- **Pixel-perfect & fully responsive UI** designed for clarity and speed.

## How to Install
```bash
git clone https://github.com/devdignesh/token_portfolio.git
cd token_portfolio
npm install
npm run dev
```

## Performance & Optimization

- **Lazy Loading**: Dynamically import modal and chart components.
- **React Optimizations**: Used React.memo, useCallback, and useMemo to minimize re-renders.
- **Infinite Scroll**: Auto-fetch tokens in AddTokenModal when scrolling.
- **Bundle Optimization**: Manual chunking in Vite config to separate vendor libs.
- **Build Efficiency**: Increased Vite chunk size limit for smoother performance.




## Project Insight

This project showcases advanced **frontend architecture**, **state management**, and **real-time data handling** with crypto APIs. <br/>
It reflects my focus on **pixel-perfect UI**, **scalable component design**, and **performance tuning** in production-level applications.


