import './Index.css';
import "../../bootstrap/css/bootstrap.min.css";
import Musor from './musor/Musor';
import VetitesIdopontLista from './musor/VetitesIdopontLista';
export default function Index() {
    document.title = "Főoldal - Premozi";
    return (
        <div>
            
            <Musor />
            <VetitesIdopontLista />
        </div>        
    );
};