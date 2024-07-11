import { Multiplier } from './type';

enum MultiplierColor {
   BrightRed = '#FF0000',
   OrangeRed = '#FF4500',
   DarkOrange = '#FF8C00',
   Orange = '#FFA500',
   LightOrange = '#FFAC00',
   LighterOrange = '#FFB800',
   VeryLightOrange = '#FFC400',
   Gold = '#FFD700',
   Yellow = '#FFFF00',
}

const Multiplier16: Multiplier[] = [
   { value: 110, color: MultiplierColor.BrightRed },
   { value: 41, color: MultiplierColor.OrangeRed },
   { value: 10, color: MultiplierColor.DarkOrange },
   { value: 5, color: MultiplierColor.Orange },
   { value: 3, color: MultiplierColor.LightOrange },
   { value: 1.5, color: MultiplierColor.LighterOrange },
   { value: 1, color: MultiplierColor.VeryLightOrange },
   { value: 0.5, color: MultiplierColor.Gold },
   { value: 0.3, color: MultiplierColor.Yellow },
   { value: 0.5, color: MultiplierColor.Gold },
   { value: 1, color: MultiplierColor.VeryLightOrange },
   { value: 1.5, color: MultiplierColor.LighterOrange },
   { value: 3, color: MultiplierColor.LightOrange },
   { value: 5, color: MultiplierColor.Orange },
   { value: 10, color: MultiplierColor.DarkOrange },
   { value: 41, color: MultiplierColor.OrangeRed },
   { value: 110, color: MultiplierColor.BrightRed },
];

export function getMultiplier(index: number): Multiplier[] {
   switch (index) {
      case 16:
         return Multiplier16;
      default:
         return [];
   }
}

export function getMultiplierColorFromValue(value: number) {
   switch (value) {
      case 110:
         return MultiplierColor.BrightRed;
      case 41:
         return MultiplierColor.OrangeRed;
      case 10:
         return MultiplierColor.DarkOrange;
      case 5:
         return MultiplierColor.Orange;
      case 3:
         return MultiplierColor.LightOrange;
      case 1.5:
         return MultiplierColor.LighterOrange;
      case 1:
         return MultiplierColor.VeryLightOrange;
      case 0.5:
         return MultiplierColor.Gold;
      case 0.3:
         return MultiplierColor.Yellow;
      default:
         return MultiplierColor.Gold;
   }
}
