
function Load() {
   // Motif de croix (pharmacie) - positions des éléments actifs
   const crossPattern = [
     false, true, false,  // Ligne 1: seul le centre
     true, true, true,    // Ligne 2: toute la ligne
     false, true, false   // Ligne 3: seul le centre
   ];

   return(
    <div className="wrapper fixed top-0 left-0 w-screen h-screen bg-white flex items-center justify-center z-50">
        <div className="contain relative">
          {/* Motif de croix pour l'animation */}
          <div className="container grid grid-cols-3 gap-1 sm:gap-2 w-16 sm:w-20 md:w-24">
            {crossPattern.map((isActive, index) => (
              <div 
                key={index} 
                className={`box w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full ${
                  isActive ? 'bg-[#10425d]' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
    </div>
   );
};

export default Load;