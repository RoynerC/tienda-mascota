import React from 'react';
import './Inicio.css';

const Inicio = () => {
  // Datos de productos destacados
  const productosDestacados = [
    {
      id: 1,
      nombre: "Alimentos Premium",
      descripcion: "Alimentos balanceados para todas las razas y edades",
      icono: "fas fa-bone"
    },
    {
      id: 2,
      nombre: "Medicamentos",
      descripcion: "Fármacos y suplementos veterinarios de calidad",
      icono: "fas fa-pills"
    },
    {
      id: 3,
      nombre: "Accesorios",
      descripcion: "Juguetes, correas, camas y más para tu mascota",
      icono: "fas fa-tshirt"
    }
  ];

  // Datos de servicios
  const servicios = [
    {
      id: 1,
      nombre: "Consulta Veterinaria",
      descripcion: "Atención profesional para diagnóstico y tratamiento",
      icono: "fas fa-stethoscope"
    },
    {
      id: 2,
      nombre: "Peluquería Canina",
      descripcion: "Corte, baño y cuidado estético profesional",
      icono: "fas fa-cut"
    },
    {
      id: 3,
      nombre: "Vacunación",
      descripcion: "Esquema completo de vacunas para protección",
      icono: "fas fa-syringe"
    },
    {
      id: 4,
      nombre: "Urgencias 24/7",
      descripcion: "Atención inmediata para emergencias veterinarias",
      icono: "fas fa-ambulance"
    }
  ];

  return (
    <div className="inicio-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="logo-container">
            <div className="logo">
              <i className="fas fa-paw"></i>
            </div>
            <h1>Agroveterinaria la Fé</h1>
          </div>
          <h2>Cuidamos a tus mascotas como se merecen</h2>
          <p>Más de 10 años de experiencia en cuidado animal. Ofrecemos productos de calidad y servicios veterinarios profesionales.</p>
          <div className="hero-buttons">
          </div>
        </div>
        <div className="hero-image">
          <i className="fas fa-dog"></i>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="servicios-section">
        <h2 className="section-title">Nuestros Servicios</h2>
        <div className="servicios-grid">
          {servicios.map(servicio => (
            <div key={servicio.id} className="servicio-card">
              <div className="servicio-icon">
                <i className={servicio.icono}></i>
              </div>
              <h3>{servicio.nombre}</h3>
              <p>{servicio.descripcion}</p>
              
            </div>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="productos-section">
        <div className="section-header">
          <h2 className="section-title">Productos Destacados</h2>
          <p>Los productos más vendidos y recomendados por nuestros clientes</p>
        </div>
        <div className="productos-grid">
          {productosDestacados.map(producto => (
            <div key={producto.id} className="producto-card">
              <div className="producto-icon">
                <i className={producto.icono}></i>
              </div>
              <div className="producto-content">
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <div className="producto-precio">{producto.precio}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Información de Contacto */}
      <section className="contacto-section">
        <div className="contacto-content">
          <div className="contacto-info">
            <h2>¿Necesitas ayuda?</h2>
            <p>Estamos aquí para atenderte y resolver todas tus dudas sobre el cuidado de tus mascotas.</p>
            
            <div className="contacto-details">
              <div className="contacto-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Visítanos</h4>
                  <p>Ciudad Rama Frente a paneles Paz</p>
                </div>
              </div>
              
              <div className="contacto-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h4>Llámanos</h4>
                  <p>57436949</p>
                </div>
              </div>
              
              <div className="contacto-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Horario</h4>
                  <p>Lunes a Sábado: 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contacto-image">
            <i className="fas fa-veterinary"></i>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;