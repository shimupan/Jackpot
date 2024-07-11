import { useContext, useEffect, useRef } from 'react';
import {
   Bodies,
   Body,
   Engine,
   Events,
   IEventCollision,
   Render,
   Runner,
   World,
} from 'matter-js';
import { getMultiplier } from './Multipliers';
import { ProfileContext } from '../../../components';
import { collisionCategories } from './addBall';
import { Multiplier } from './type';

const drawTextOnCanvas = (render: Matter.Render, text: string, position: {x : number, y : number}) => {
   const ctx = render.context;
   ctx.save();
   ctx.beginPath();
   ctx.font = 'bold 12px "Impact", sans-serif';
   ctx.fillStyle = '#000';
   ctx.textAlign = 'center';
   ctx.fillText(text, position.x, position.y+5);
   ctx.closePath();
   ctx.restore();
 };

const PlinkoGame = ({
   gameProps,
   balance,
   updateBalance,
   setHistory,
   multiplierBucket,
   setMultiplierBucket,
}: {
   gameProps: {
      engine: Engine;
      width: number;
      height: number;
      startingPinNumber: number;
      pinRadius: number;
      pinSpacing: number;
   };
   balance: number;
   updateBalance: React.Dispatch<React.SetStateAction<number>>;
   setHistory: React.Dispatch<React.SetStateAction<Multiplier[]>>;
   preview: boolean;
   multiplierBucket?: { [key: number]: number[] };
   setMultiplierBucket?: React.Dispatch<
      React.SetStateAction<{ [key: number]: number[] }>
   >;
}) => {
   const User = useContext(ProfileContext);
   // Define game properties
   const engine = gameProps.engine;
   const width = gameProps.width;
   const height = gameProps.height;
   const startingPinNumber = gameProps.startingPinNumber;
   const pinRadius = gameProps.pinRadius;
   const pinSpacing = gameProps.pinSpacing;
   // Game setup
   const gameRef = useRef<HTMLDivElement>(null);
   useEffect(() => {
      engine.gravity.y = import.meta.env.VITE_GRAVITY_VALUE; // use 0.3 for development 0.7 for production
      
      // Render setup
      if (gameRef.current) {
         const render = Render.create({
            element: gameRef.current,
            engine: engine,
            bounds: {
               min: { x: 0, y: 0 },
               max: { x: width, y: height },
            },
            options: {
               background: '#334155',
               hasBounds: true,
               width: width,
               height: height,
               wireframes: false,
            },
         });

         const runner = Runner.create();
         Runner.run(runner, engine);
         Render.run(render);

         // Placing Pins
         const pins: Body[] = [];
         for (let l = 0; l < 16; l++) {
            const linePins = startingPinNumber + l;
            const lineWidth = (linePins - 1) * pinSpacing;
            for (let i = 0; i < linePins; i++) {
               const pinX = (width - lineWidth) / 2 + i * pinSpacing;
               const pinY = 50 + l * pinSpacing;
               const pin = Bodies.circle(pinX, pinY, pinRadius, {
                  label: `pin-${l}-${i}`,
                  collisionFilter: {
                     category: collisionCategories.pinCategory,
                     // Pins will not collide with each other, but will collide with balls
                     mask: collisionCategories.ballCategory,
                  },
                  render: {
                     fillStyle: '#FFFFFF',
                  },
                  isStatic: true,
               });
               pins.push(pin);
            }
         }

         // Placing Multiplier
         const multiplierBody: Body[] = [];
         const multiplier = getMultiplier(16);

         for (let i = 0; i < multiplier.length; i++) {
            const pinX = 80 + i * 40; // starting position + i * spacing
            const pinY = 680;
            const pin = Bodies.rectangle(pinX, pinY, 25, 25, {
               label: `multiplier-${multiplier[i].value}-${i}-${multiplier[i].color}`,
               collisionFilter: {
                  category: collisionCategories.multiplierCategory,
                  // Multipliers will not collide with each other, but will collide with balls
                  mask: collisionCategories.ballCategory,
               },
               render: {
                  fillStyle: multiplier[i].color,
               },
               chamfer: { radius: 3 },
               isStatic: true,
            });
            multiplierBody.push(pin);
         }

         World.add(engine.world, pins);
         World.add(engine.world, multiplierBody);

         Events.on(render, 'afterRender', () => {
            multiplier.forEach((multiplier, index) => {
              const position = { x: 80 + index * 40, y: 680 };
              drawTextOnCanvas(render, `x${multiplier.value}`, position);
            });
          });

         return () => {
            World.clear(engine.world, true);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
         };
      }
   }, [gameRef]);

   useEffect(() => {
      const collisionHandler = (event: IEventCollision<Engine>) => {
         event.pairs.forEach((pair) => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;

            // Check if one body is a ball and the other is a multiplier
            if (
               bodyA.label.startsWith('multiplier') &&
               bodyB.label.startsWith('ball')
            ) {
               World.remove(engine.world, bodyB);
               const multiplierValue = parseFloat(bodyA.label.split('-')[1]);
               const multiplierColor = bodyA.label.split('-')[3];
               const ballValue = parseFloat(bodyB.label.split('-')[1]);
               const ballTimeStamp = parseFloat(bodyB.label.split('-')[3]);
               const ballPreviewMode = parseInt(bodyB.label.split('-')[4]) === 1;
               const profit = ballValue * multiplierValue;
               const newBalance = balance + profit;
               updateBalance(newBalance);
               User?.setBalance(newBalance);

               // The ball already got added earlier in the simulation
               if(!ballPreviewMode) {
                  // Add the multiplier to the history
                  const multiplier: Multiplier = { value: multiplierValue, color: multiplierColor, timestamp: ballTimeStamp };
                  setHistory((prevHistory) => {
                     const lastMultiplier = prevHistory[0];
                     let newHistory = prevHistory;
                     if (lastMultiplier && lastMultiplier.value === multiplier.value && lastMultiplier.color === multiplier.color && lastMultiplier.timestamp === multiplier.timestamp) {
                        return prevHistory;
                     } else {
                        newHistory = [multiplier, ...prevHistory];
                     }
                     if(newHistory.length > 5) {
                        newHistory.pop();
                     }
                     return newHistory;
                  });
               }

               // used in PlinkoSimulation.tsx to track ballX and the multiplier
               if (multiplierBucket && setMultiplierBucket) {
                  const multiplierIndex = parseInt(bodyA.label.split('-')[2]);
                  const ballX = parseFloat(bodyB.label.split('-')[2]);

                  const updatedMultiplierBucket = { ...multiplierBucket };
                  const lastAddedValue =
                     updatedMultiplierBucket[multiplierIndex].slice(-1)[0];
                  if (lastAddedValue === ballX) {
                     return;
                  }
                  updatedMultiplierBucket[multiplierIndex].push(ballX);

                  // Use setMultiplierBucket to update the state
                  setMultiplierBucket(updatedMultiplierBucket);
               }
            }
         });
      };

      Events.on(engine, 'collisionStart', collisionHandler);

      // Cleanup function to remove the event listener
      return () => {
         Events.off(engine, 'collisionStart', collisionHandler);
      };
   }, [engine, balance]);

   return (
      <>
         {/* Plinko Game */}
         <div ref={gameRef} />
      </>
   );
};

export default PlinkoGame;
