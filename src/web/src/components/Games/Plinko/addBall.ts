import {
   Bodies,
   Engine,
   World,
} from 'matter-js';
import axios from 'axios';

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
    simulate: boolean
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
             const multiplier = response.data.multiplier;
             console.log('Got multiplier:', multiplier, 'for ballX:', ballX);
             console.log('ballX', ballX);
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