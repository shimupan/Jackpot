import express from 'express';
import cors from 'cors';
import { development, production } from './outcomes.js';

const app = express();
app.use(cors());

const Multiplier16 = [
   110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110,
];

const DROPS = 16;

app.get('/drops', (req, res) => {
   let multiplierIndex = 0;
   const drops = [];
   for (let i = 0; i < DROPS; i++) {
      if (Math.random() > 0.5) {
         drops.push('Left');
         multiplierIndex++;
      } else {
         drops.push('Right');
      }
   }
   const multiplier = Multiplier16[multiplierIndex];
   let result;
   if(process.env.NODE_ENV === 'production') {
      console.log('Production')
      result = production[multiplierIndex];
   } else {
      console.log('Development')
      result = development[multiplierIndex];
   }
   res.send({
      ballX: result[Math.floor(Math.random() * result.length || 0)],
      multiplier,
      drops,
   });
});

app.listen(3001, () => {
   console.log('Server is running on http://localhost:3001');
});
