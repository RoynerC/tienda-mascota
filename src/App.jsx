import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Inicio from './views/Inicio';
import Mascotas from './views/Mascotas';
import AgregarMascota from './views/AgregarMascota';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/mascotas" element={<Mascotas />} />
          <Route path="/agregar" element={<AgregarMascota />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;