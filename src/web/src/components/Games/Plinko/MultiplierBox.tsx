const MultiplierBox = ({
   x,
   y,
   text,
}: {
   x: number;
   y: number;
   text: string;
}) => {
   return (
      <div
         style={{ position: 'absolute', left: `${x}px`, top: `${y}px` }}
         className='w-5 h-5 border border-black bg-black flex items-center justify-center'
      >
         {text}
      </div>
   );
};

export default MultiplierBox;
