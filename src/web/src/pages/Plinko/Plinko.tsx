import { useContext, useEffect, useState } from 'react';
import { Engine } from 'matter-js';
import { PlinkoGame, ProfileContext } from '../../components';
import { addBall } from '../../components/Games/Plinko/PlinkoGame';
import useCookie from '../../hooks/useCookies';
import { Link } from 'react-router-dom';

const Plinko = () => {
   const User = useContext(ProfileContext);
   const [balance, updateBalance] = useCookie('userToken', 1000) as [
      number,
      React.Dispatch<React.SetStateAction<number>>
   ];
   const [value, setValue] = useState(10);
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
         addBall(engine, width, pinRadius, pinSpacing, value, false);
      } else {
         alert('Insufficient balance');
      }
   }

   // useEffect(() => {
   //    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
   //       e.preventDefault();
   //    };

   //    window.addEventListener('beforeunload', handleBeforeUnload);

   //    return () => {
   //       window.removeEventListener('beforeunload', handleBeforeUnload);
   //    };
   // }, []);

   return (
      <>
         {/* CONTAINER */}
         <div className='ml-header-left-offset pt-header-top-offset w-screen h-screen bg-slate-700'>
            {/* GAME CONTAINER */}
            <div className='flex justify-center'>
               <PlinkoGame
                  gameProps={gameProps}
                  balance={balance}
                  updateBalance={updateBalance}
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
               </div>
            </div>
            <Link to='/plinko/simulate'>
               <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'>
                  Simulate Plinko
               </button>
            </Link>
         </div>
      </>
   );
};

export default Plinko;
