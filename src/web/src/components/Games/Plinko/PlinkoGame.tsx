import { useContext, useEffect, useRef, useState } from 'react';
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
import axios from 'axios';

const collisionCategories = {
   ballCategory: 0x0001,
   pinCategory: 0x0002,
   multiplierCategory: 0x0004,
};

export function addBall(
   engine: Engine,
   width: number,
   pinRadius: number,
   pinSpacing: number,
   value: number,
   simulate: boolean
): void {
   // Initial calculations
   let ballX;
   if(simulate) {
      const centerLine = width / 2;
      const totalPinsWidth = pinRadius * 3;
      const maxOffset = (totalPinsWidth + pinSpacing * 2) / 2;
      const randomOffset = Math.random() * maxOffset * 2 - maxOffset;
      ballX = centerLine + randomOffset;

      const ball = Bodies.circle(ballX, 0, 6, {
         label: `ball-${value}-${ballX}`,
         collisionFilter: {
            category: collisionCategories.ballCategory,
            // Balls will not collide with each other, but will collide with pins and multipliers
            mask:
               collisionCategories.pinCategory |
               collisionCategories.multiplierCategory,
         },
         restitution: 1,
         friction: 1,
         render: {
            fillStyle: '#FF0000',
         },
      });
      World.add(engine.world, ball);
   } else {
      //Fetch predetermined calculation
      axios
         .get('/drops')
         .then((response) => {
            ballX = response.data.ballX;
            const ball = Bodies.circle(ballX, 0, 6, {
               label: `ball-${value}-${ballX}`,
               collisionFilter: {
                  category: collisionCategories.ballCategory,
                  // Balls will not collide with each other, but will collide with pins and multipliers
                  mask:
                     collisionCategories.pinCategory |
                     collisionCategories.multiplierCategory,
               },
               restitution: 1,
               friction: 1,
               render: {
                  fillStyle: '#FF0000',
               },
            });
            World.add(engine.world, ball);
            return;
         })
         .catch((error) => {
            console.error('Error fetching ballX', error);
         });
   }
}

const PlinkoGame = ({
   gameProps,
   balance,
   updateBalance,
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
   const [multiplierText, setMultiplierText] = useState<Body[]>([]);

   useEffect(() => {
      engine.gravity.y = 0.3;

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
            const pin = Bodies.rectangle(pinX, pinY, 20, 20, {
               label: `multiplier-${multiplier[i].value}-${i}`,
               collisionFilter: {
                  category: collisionCategories.multiplierCategory,
                  // Multipliers will not collide with each other, but will collide with balls
                  mask: collisionCategories.ballCategory,
               },
               render: {
                  fillStyle: multiplier[i].color,
               },
               isStatic: true,
            });
            multiplierBody.push(pin);
         }

         setMultiplierText(multiplierBody);

         World.add(engine.world, pins);
         World.add(engine.world, multiplierBody);

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
               const ballValue = parseFloat(bodyB.label.split('-')[1]);
               const profit = ballValue * multiplierValue;
               const newBalance = balance + profit;
               updateBalance(newBalance);
               User?.setBalance(newBalance);

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

   // Function to calculate the correct position
   // const calculatePosition = (multiplier: Body) => {
   //    const gameBoardRect = gameRef.current!.getBoundingClientRect();
   //    const scaleX = 1;
   //    const scaleY = 1;

   //    const adjustedX = multiplier.position.x * scaleX + gameBoardRect.left;
   //    const adjustedY = multiplier.position.y * scaleY + gameBoardRect.top;

   //    return { x: adjustedX, y: adjustedY };
   // };

   return (
      <>
         {/* Plinko Game */}
         <div ref={gameRef} />
         {multiplierText.map((multiplier) => {
            return (
               <div
                  key={multiplier.label}
                  style={{
                     position: 'absolute',
                     left: multiplier.position.x + 553,
                     top: multiplier.position.y + 45,
                     color: 'black',
                     fontSize: '15px',
                  }}
               >
                  {multiplier.label.split('-')[1]}
               </div>
            );
         })}
      </>
   );
};

export default PlinkoGame;
