import React from "react";
import * as Logos from "../assets"; // import all logo exports

const logoComponents = Object.values(Logos);

const RandomLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const RandomLogoComp =
    logoComponents[Math.floor(Math.random() * logoComponents.length)];
  return <RandomLogoComp {...props} />;
};

export default RandomLogo;
