import Navbar from "../Acceuil/views/Navbar";
import { Apparence } from "../Acceuil/views/Apparence";
import { GroupWrapper } from "../Acceuil/views/GroupWrapper";
import { Footer } from "../Acceuil/views/Footer";
import Grouper from "../Acceuil/views/Group";
import Vitrine from "../Acceuil/views/Vitrine";
import Descript from "../Acceuil/views/Descript";
import Testimonials from "../Acceuil/views/Testimonials";
import RealTimeStats from "../Acceuil/views/RealTimeStats";


const Accueil = () => {
    return(
      <div className="custom-scrollbar">
        <Navbar/>
        <Apparence/>
        <Grouper/>
        <Descript/>
        <Vitrine/>
        <GroupWrapper/>
        <RealTimeStats/>
        <Testimonials/>
        <Footer/>   
      </div>
    );
};

export default Accueil;