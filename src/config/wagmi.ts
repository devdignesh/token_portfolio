import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Token Portfolio",
  projectId: import.meta.env.VITE_REACT_APP_WALLET_CONNECT_PROJECT_ID || "",
  chains: [mainnet, sepolia],
});
