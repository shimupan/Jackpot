import { Link } from "react-router-dom";

const Card = ({ title }: { title: string }) => {
  return (
    <>
      <Link to={`${title}`}>
        <div
          className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 flex justify-center items-center
                        transform transition duration-500 hover:scale-105 hover:bg-gray-100 cursor-pointer"
        >
          <p className="text-lg font-semibold text-gray-800">{title}</p>
        </div>
      </Link>
    </>
  );
};

export default Card;
