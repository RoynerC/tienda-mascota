import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const AgregarMascota = () => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    especie: 'perro',
    precio: '',
    descripcion: '',
    imagen: ''
  });
  const [enviando, setEnviando] = useState(false);

  const manejarCambioImagen = (evento) => {
    const archivo = evento.target.files[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onloadend = () => {
        setFormulario({ ...formulario, imagen: lector.result });
      };
      lector.readAsDataURL(archivo);
    }
  };

  const manejarCambio = (evento) => {
    setFormulario({
      ...formulario,
      [evento.target.name]: evento.target.value
    });
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setEnviando(true);

    try {
      await addDoc(collection(db, 'mascotas'), {
        ...formulario,
        precio: parseFloat(formulario.precio),
        fecha: new Date()
      });
      
      alert('¡Mascota agregada exitosamente!');
      setFormulario({
        nombre: '',
        especie: 'perro',
        precio: '',
        descripcion: '',
        imagen: ''
      });
      // Limpiar input de archivo
      document.getElementById('imagen').value = '';
    } catch (error) {
      console.error('Error agregando mascota:', error);
      alert('Error al agregar mascota');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h2 className="card-title mb-0">Agregar Nueva Mascota</h2>
            </div>
            <div className="card-body">
              <form onSubmit={manejarEnvio}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre de la mascota:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="especie" className="form-label">Especie:</label>
                  <select 
                    className="form-select"
                    id="especie"
                    name="especie" 
                    value={formulario.especie} 
                    onChange={manejarCambio}
                  >
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="loro">Loro</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="precio" className="form-label">Precio ($):</label>
                  <input
                    type="number"
                    className="form-control"
                    id="precio"
                    name="precio"
                    value={formulario.precio}
                    onChange={manejarCambio}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción:</label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={manejarCambio}
                    required
                    rows="3"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="imagen" className="form-label">Imagen:</label>
                  <input
                    type="file"
                    className="form-control"
                    id="imagen"
                    accept="image/*"
                    onChange={manejarCambioImagen}
                    required
                  />
                  {formulario.imagen && (
                    <div className="mt-3">
                      <p className="text-muted">Vista previa:</p>
                      <img 
                        src={formulario.imagen} 
                        alt="Vista previa" 
                        className="img-thumbnail"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                      />
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success w-100"
                  disabled={enviando}
                >
                  {enviando ? 'Agregando...' : 'Agregar Mascota'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarMascota;