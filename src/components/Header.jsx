import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-success text-white shadow">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-3">
          <h1 className="h4 mb-0">🐾 Agroveterinaria la Fé</h1>
          <nav>
            <Link to="/" className="text-white text-decoration-none mx-2">Inicio</Link>
            <Link to="/mascotas" className="text-white text-decoration-none mx-2">Mascotas</Link>
            <Link to="/agregar" className="text-white text-decoration-none mx-2">Agregar Mascota</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;