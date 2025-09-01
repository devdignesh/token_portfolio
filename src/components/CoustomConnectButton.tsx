import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletIcon } from "../assets/Wallet";
export const CoustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="cursor-pointer text-[13px] font-medium text-neutral-950 flex gap-1.5 items-center bg-[#A9E851] py-1.5 px-2.5 rounded-full border border-[#1F6619] hover:bg-[#b0f353] duration-300 ease-in-out"
                  >
                    <WalletIcon width={16} height={15} />
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                    className="cursor-pointer h-full text-neutral-950 flex gap-1.5 items-center bg-[#A9E851] py-2 px-2.5  rounded-full border border-[#1F6619] hover:bg-[#b0f353] hover:shadow-md transition-shadow duration-300 ease-in-out"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                  </button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="cursor-pointer overflow-hidden text-nowrap text-[13px] font-medium text-neutral-950 flex gap-1.5 items-center bg-[#A9E851] py-1.5 px-2.5 rounded-full border border-[#1F6619] hover:bg-[#b0f353] hover:shadow-md transition-shadow duration-300 ease-in-out"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
