import { useContext, useEffect, useState } from 'react';
import { Engine } from 'matter-js';
import { MultiplierHistory, PlinkoGame, ProfileContext } from '../../components';
import { addBall } from '../../components/Games/Plinko/addBall';
import useCookie from '../../hooks/useCookies';
import { Multiplier } from '../../components/Games/Plinko/type';

function sleep(ms: number) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

const PlinkoSimulation = () => {
   
   // Zoom out on mobile
   useEffect(() => {
      // Function to adjust the viewport for the special page
      const adjustViewport = () => {
         const viewport = document.querySelector('meta[name=viewport]');
         viewport!.setAttribute(
            'content',
            'width=device-width, initial-scale=0.45'
         );
      };

      // Function to reset the viewport when leaving the page
      const resetViewport = () => {
         const viewport = document.querySelector('meta[name=viewport]');
         viewport!.setAttribute(
            'content',
            'width=device-width, initial-scale=1.0'
         );
      };

      adjustViewport();
      return () => resetViewport();
   }, []);

   const User = useContext(ProfileContext);
   const [balance, updateBalance] = useCookie('userToken', 1000) as [
      number,
      React.Dispatch<React.SetStateAction<number>>
   ];
   const [value, setValue] = useState(10);
   const [startSimulation, setStartSimulation] = useState(false);
   const [outputs, setOutputs] = useState<{ [key: number]: number[] }>({
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
      13: [],
      14: [],
      15: [],
      16: [],
      17: [],
   });
   const [history, setHistory] = useState<Multiplier[]>([]);
   const [preview, setPreview] = useState<boolean>(false);
   useEffect(() => {
      setPreview(false);
   }, []);
   // Game setup
   const [engine] = useState(() => Engine.create());
   const gameProps = {
      engine: engine,
      width: 800,
      height: 700,
      startingPinNumber: 3,
      pinRadius: 5,
      pinSpacing: 40,
   };

   async function simulate(
      engine: Engine,
      width: number,
      pinRadius: number,
      pinSpacing: number,
      value: number
   ) {
      if (balance >= value) {
         while (startSimulation) {
            const newBalance = balance - value;
            updateBalance(newBalance);
            User?.setBalance(newBalance);
            addBall(engine, width, pinRadius, pinSpacing, value, true, preview, setHistory);

            await sleep(500);
         }
      } else {
         alert('Insufficient balance');
      }
   }

   return (
      <>
         {/* CONTAINER */}
         <div className='ml-header-left-offset pt-header-top-offset w-screen min-h-screen bg-slate-700'>
            {/* GAME HISTORY */ }
            <div className='flex md:justify-center'>
               <p className='text-white font-bold text-lg'>Multiplier History</p>
               <MultiplierHistory history={history} />
            </div>
            {/* GAME CONTAINER */}
            <div className='flex justify-center'>
               <PlinkoGame
                  gameProps={gameProps}
                  balance={balance}
                  updateBalance={updateBalance}
                  setHistory={setHistory}
                  preview={preview}
                  multiplierBucket={outputs}
                  setMultiplierBucket={setOutputs}
               />
            </div>
            <div className='flex justify-center'>
               <div className='flex max-w-md w-full space-x-3 items-center'>
                  <p className='text-white'>Amount:</p>
                  <input
                     type='number'
                     value={value}
                     onChange={(e) => setValue(Number(e.target.value))}
                     className='w-16 p-1 rounded bg-gray-800 text-white focus:outline-none focus:ring-0 appearance-none'
                  />
                  <button
                     onClick={() => {
                        setStartSimulation(true);
                        simulate(
                           gameProps.engine,
                           gameProps.width,
                           gameProps.pinRadius,
                           gameProps.pinSpacing,
                           value
                        );
                     }}
                     className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'
                  >
                     Start Simulation
                  </button>
                  <button
                     onClick={() => {
                        setStartSimulation(false);
                     }}
                     className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'
                  >
                     Stop Simulation
                  </button>
               </div>
            </div>
            <pre className='text-white'>{JSON.stringify(outputs, null, 2)}</pre>
         </div>
      </>
   );
};

export default PlinkoSimulation;
