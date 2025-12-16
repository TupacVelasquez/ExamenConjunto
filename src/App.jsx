import TicketList from './components/TicketList'; // <-- Importamos nuestro componente principal
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- ESTILOS CONSTANTES ---
// NOTA: Es ideal mover estas constantes a un archivo compartido (src/styles/constants.js)
const KICK_GREEN = '#00F400';
const DARK_BG = '#1A1A1A';

function App() {
  return (
    // Aplicamos el fondo oscuro a toda la aplicación
    <div className="App" style={{ backgroundColor: DARK_BG, minHeight: '100vh' }}> 
      
      {/* Encabezado con color de fondo oscuro y texto en verde Kick */}
      <header style={{ 
        padding: '20px', 
        backgroundColor: DARK_BG, 
        borderBottom: `2px solid ${KICK_GREEN}` 
      }}>
        <h1 style={{ color: KICK_GREEN, margin: 0 }}>
          Sistema de Tickets VelasquezTupac
        </h1>
      </header>
      
      {/* El main contendrá el TicketList */}
      <main> 
        <TicketList />
      </main>

      {/* CONTENEDOR DE TOASTS (DEBE IR UNA SOLA VEZ AL FINAL DEL COMPONENTE PRINCIPAL) */}
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="dark" // Usamos el tema oscuro que coincide con tu diseño
      />
    </div>
  );
}

export default App;