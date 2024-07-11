import {
   Bodies,
   Engine,
   World,
} from 'matter-js';
import axios from 'axios';
import { Multiplier } from './type';
import { getMultiplierColorFromValue } from './Multipliers';

export const collisionCategories = {
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
    simulate: boolean,
    preview: boolean,
    setHistory: React.Dispatch<React.SetStateAction<Multiplier[]>>,
 ): void {
    // Initial calculations
    let ballX;
    if (simulate) {
       const centerLine = width / 2;
       const totalPinsWidth = pinRadius * 3;
       const maxOffset = (totalPinsWidth + pinSpacing * 2) / 2;
       const randomOffset = Math.random() * maxOffset * 2 - maxOffset;
       ballX = centerLine + randomOffset;
 
       const ball = Bodies.circle(ballX, 0, 6, {
          label: `ball-${value}-${ballX}-${Date.now()}`,
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
             const multiplier: number = response.data.multiplier;
             const ballTimeStamp = Date.now();
             const ball = Bodies.circle(ballX, 0, 6, {
                label: `ball-${value}-${ballX}-${ballTimeStamp}`,
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
             // Display predetermined calculations if prompted
             if(preview) {
               const mul: Multiplier = { value: multiplier, color: getMultiplierColorFromValue(multiplier), timestamp: ballTimeStamp};
               setHistory((prevHistory) => {
                  const lastMultiplier = prevHistory[0];
                  let newHistory = prevHistory;
                  if (lastMultiplier && lastMultiplier.value === mul.value && lastMultiplier.color === mul.color && lastMultiplier.timestamp === mul.timestamp) {
                     return prevHistory;
                  } else {
                     newHistory = [mul, ...prevHistory];
                  }
                  if(newHistory.length > 5) {
                     newHistory.pop();
                  }
                  return newHistory;
               });
             }

             World.add(engine.world, ball);
             return;
          })
          .catch((error) => {
             console.error('Error fetching ballX', error);
          });
    }
 }