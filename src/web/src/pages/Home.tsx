import { Card } from "../components";

const Home = () => {
  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center bg-slate-700">
        {/* CARDS */}
        <div className="flex flex-row space-x-3">
         <Card title="Plinko" />
        </div>
      </div>
    </>
  );
};

export default Home;
