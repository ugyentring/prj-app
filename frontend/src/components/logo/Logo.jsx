import logo from "../../assets/NNlogo.svg";

const Logo = () => {
  return (
    <div className="flex items-center">
      <img
        src={logo}
        alt="Logo"
        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
      />
      <span className="ml-2 text-xs md:text-sm lg:text-base xl:text-lg text-green-700 hidden md:block">
        NorbNode
      </span>
    </div>
  );
};

export default Logo;
