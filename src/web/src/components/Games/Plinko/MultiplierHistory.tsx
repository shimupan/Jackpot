import { Multiplier } from "./type";

const MultiplierHistory = ({ history }: { history: Multiplier[] }) => {
  return (
    <div className="flex flex-row gap-0.5">
      {history.map((item, index) => (
        <div
          key={index}
          style={{ backgroundColor: item.color }}
          className={`flex items-center justify-center w-10 h-10 text-center ${
            index === 0 ? "rounded-l-md" : index === history.length - 1 ? "rounded-r-md" : ""
          }`}
        >
          x{item.value}
        </div>
      ))}
    </div>
  );
};

export default MultiplierHistory;