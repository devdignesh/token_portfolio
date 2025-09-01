import { LogoIcon } from "../assets/logo";
import { CoustomConnectButton } from "./CoustomConnectButton";

const Header = () => {
  return (
    <header className="p-4 flex justify-between items-center">
      <div className="flex items-center">
        <LogoIcon />
        <h1 className="text-xl font-semibold ml-2 text-nowrap">
          Token Portfolio
        </h1>
      </div>
      <div>
        <CoustomConnectButton />
      </div>
    </header>
  );
};

export default Header;
