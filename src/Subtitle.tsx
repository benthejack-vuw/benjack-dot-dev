type SubtitleProps = {
    textItems: Array<string>;
};

const Subtitle = ({ textItems }: SubtitleProps) => {
    return (
      <div className="flex justify-center">
       <div className="flex justify-center items-center fixed top-2/3">
         {
           textItems.map((itm, idx) => (
             <>
               <span className="text-3xl font-[Raleway]" key={itm}>
                 {itm}
               </span>
               {
                 idx < textItems.length - 1 && (
                  <span className="border-b-black border-b border-b-2 w-8 mx-4"/>
                 )
               }
            </>
           ))
         }
       </div>
      </div>
    );
};

export default Subtitle;