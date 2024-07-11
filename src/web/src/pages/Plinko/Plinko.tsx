import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Engine } from 'matter-js';
import { PlinkoGame, ProfileContext, MultiplierHistory, ToggleSlider } from '../../components';
import { addBall } from '../../components/Games/Plinko/addBall';
import { Multiplier } from '../../components/Games/Plinko/type';
import useCookie from '../../hooks/useCookies';

const Plinko = () => {

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
   const [history, setHistory] = useState<Multiplier[]>([]);
   const [preview, setPreview] = useState<boolean>(false);

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

   function addBallWrapper(
      engine: Engine,
      width: number,
      pinRadius: number,
      pinSpacing: number,
      value: number
   ) {
      if (balance >= value) {
         const newBalance = balance - value;
         updateBalance(newBalance);
         User?.setBalance(newBalance);
         addBall(engine, width, pinRadius, pinSpacing, value, false, preview, setHistory);
      } else {
         alert('Insufficient balance');
      }
   }

   return (
      <>
         {/* CONTAINER */}
         <div className='ml-header-left-offset pt-header-top-offset w-screen min-h-screen bg-slate-700'>
            {/* GAME HISTORY */ }
            <div className='flex flex-col md:justify-center items-center'>
               <p className='text-white font-bold text-lg'>Multiplier History</p>
               <div className='relative h-3'>
                  <MultiplierHistory history={history} />
               </div>
            </div>
            {/* GAME CONTAINER */}
            <div className='flex md:justify-center'>
               <PlinkoGame
                  gameProps={gameProps}
                  balance={balance}
                  updateBalance={updateBalance}
                  setHistory={setHistory}
                  preview={preview}
               />
            </div>
            <div className='flex justify-center'>
               <div className='flex max-w-md w-full space-x-3 items-center'>
                  {/* Setting */}
                  <div className='flex justify-center'>
                     <div className='flex max-w-md w-full flex-col items-center space-y-2'>
                        <div className='flex items-center space-x-2'>
                           <p className='text-white'>Amount: $</p>
                           <input
                              type='number'
                              value={value}
                              onChange={(e) => setValue(Number(e.target.value))}
                              className='w-16 p-1 rounded bg-gray-800 text-white focus:outline-none focus:ring-0 appearance-none'
                           />
                        </div>
                        <div className='flex space-x-2'>
                           <button
                              onClick={() => setValue(value * 0.5)}
                              className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded transition duration-300 ease-in-out text-sm'
                           >
                              0.5x
                           </button>
                           <button
                              onClick={() => setValue(value * 2)}
                              className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded transition duration-300 ease-in-out text-sm'
                           >
                              2x
                           </button>
                        </div>
                     </div>
                  </div>
                  {/* Adding */}
                  <button
                     onClick={() =>
                        addBallWrapper(
                           gameProps.engine,
                           gameProps.width,
                           gameProps.pinRadius,
                           gameProps.pinSpacing,
                           value
                        )
                     }
                     className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'
                  >
                     Add Ball
                  </button>
                  <div className='flex flex-col justify-center my-4'>
                     <p className='text-white'>Preview</p>
                     <ToggleSlider preview={preview} setPreview={setPreview} />
                  </div>
               </div>
            </div>
            <Link to='/plinko/simulate' className='flex justify-center mt-10'>
               <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'>
                  Simulate Plinko
               </button>
            </Link>
         </div>
      </>
   );
};

export default Plinko;
