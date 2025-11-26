const Inicio = () => {
  return (
    <div className="container mt-4">
      <section className="text-center py-5 bg-light rounded">
        <h1 className="display-4 text-success">Bienvenido a Agroveterinaria la Fé</h1>
        <p className="lead">Tu tienda de confianza para mascotas felices</p>
      </section>
      
      <section className="row mt-5">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title">🐶 Perros</h3>
              <p className="card-text">Encuentra tu compañero canino ideal</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title">🐱 Gatos</h3>
              <p className="card-text">Elegantes y juguetones felinos</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title">🦜 Loros</h3>
              <p className="card-text">Aves coloridas y parlantes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;