import { useAccount } from "wagmi";
import { LogoIcon } from "../assets/logo";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  const { address, isConnected } = useAccount();

  console.log("Wallet:", { address, isConnected });

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center">
        <LogoIcon />
        <h1 className="text-xl font-bold ml-2">Token Portfolio</h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 12,
        }}
      >
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
