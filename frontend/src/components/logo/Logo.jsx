import logo from "../../assets/NNlogo.svg";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
        <img src={logo} alt="NorbNode logo" className="w-6 h-6" />
      </div>
      <span className="font-display font-bold text-lg text-slate-900 hidden md:block">
        NorbNode
      </span>
    </div>
  );
};

export default Logo;
