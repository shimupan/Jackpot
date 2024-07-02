import { useContext, useState } from 'react';
import { PlinkoGame, ProfileContext } from '../components';
import { Engine } from 'matter-js';
import { addBall } from '../components/Games/Plinko/PlinkoGame';

const Plinko = () => {
   // Game setup
   const engine = Engine.create();
   const gameProps = {
      engine: engine,
      width: 800,
      height: 700,
      startingPinNumber: 3,
      pinRadius: 5,
      pinSpacing: 40,
   };

   const [value, setValue] = useState(10);

   const user = useContext(ProfileContext);

   function addBallWrapper(
      engine: Engine,
      width: number,
      pinRadius: number,
      pinSpacing: number,
      value: number
   ) {
      // if (user!.balance > value) {
      //    user!.setBalance(user!.balance - value);
      //    addBall(engine, width, pinRadius, pinSpacing, value);
      // } else {
      //    alert('Insufficient balance');
      // }
      addBall(engine, width, pinRadius, pinSpacing, value);
   }

   return (
      <>
         {/* CONTAINER */}
         <div className='ml-header-left-offset pt-header-top-offset w-screen h-screen bg-slate-700'>
            {/* GAME CONTAINER */}
            <div className='flex justify-center'>
               <PlinkoGame gameProps={gameProps} />
            </div>
            <div className='flex justify-center'>
               <div className='flex max-w-md w-full space-x-3 items-center'>
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
         </div>
      </>
   );
};

export default Plinko;
