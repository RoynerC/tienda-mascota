import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import TarjetaProducto from "../components/catalogo/TarjetaProducto";
import CuadroBusquedas from "../components/busqueda/CuadroBusquedas";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const productosCollection = collection(db, "productos");
  const categoriasCollection = collection(db, "categorias");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarProductos = async () => {
    try {
      const consulta = await getDocs(productosCollection);
      const datosProductos = consulta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(datosProductos);
      setProductosFiltrados(datosProductos);
      console.log("Productos cargados desde Firestore:", datosProductos);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const consulta = await getDocs(categoriasCollection);
      const datosCategorias = consulta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategorias(datosCategorias);
      console.log("Categorías cargadas desde Firestore:", datosCategorias);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  // Función de búsqueda mejorada con más depuración
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase().trim();
    setTextoBusqueda(texto);
    
    console.log("🔍 Buscando:", texto);
    console.log("📦 Productos totales:", productos.length);
    console.log("📂 Categorías cargadas:", categorias.length);

    if (texto === "") {
      console.log("🔄 Mostrando todos los productos");
      setProductosFiltrados(productos);
      return;
    }

    const filtrados = productos.filter((producto) => {
      const nombreCat = categorias.find((c) => c.id === producto.categoria)?.nombre || "";
      
      // Depuración para un producto específico
      if (producto.nombre && producto.nombre.toLowerCase().includes("mild")) {
        console.log("🎯 Producto 'mild' encontrado:", producto.nombre);
      }

      const coincideNombre = producto.nombre?.toLowerCase().includes(texto) || false;
      const coincideDescripcion = producto.descripcion?.toLowerCase().includes(texto) || false;
      const coincideCategoria = nombreCat.toLowerCase().includes(texto);
      const coincidePrecio = producto.precio?.toString().includes(texto) || false;
      const coincideStock = producto.stock?.toString().includes(texto) || false;

      const coincide = coincideNombre || coincideDescripcion || coincideCategoria || coincidePrecio || coincideStock;
      
      if (coincide) {
        console.log("✅ Coincidencia encontrada:", producto.nombre);
      }

      return coincide;
    });

    console.log("📊 Resultados del filtro:", filtrados.length);
    setProductosFiltrados(filtrados);
  };

  // Efecto para depurar cuando cambian los productos
  useEffect(() => {
    console.log("🔄 Productos actualizados:", productos.length);
    console.log("🔄 Productos filtrados actualizados:", productosFiltrados.length);
  }, [productos, productosFiltrados]);

  if (cargando) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <p>Cargando productos...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h4>Catálogo de Productos</h4>
      
      {/* Información de depuración */}
      <div className="mb-2">
        <small className="text-muted">
          Mostrando {productosFiltrados.length} de {productos.length} productos
          {textoBusqueda && ` para "${textoBusqueda}"`}
        </small>
      </div>

      <Row className="mb-3">
        <Col lg={6} md={8} sm={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

      <Row>
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <Col lg={4} md={6} sm={12} key={producto.id} className="mb-4">
              <TarjetaProducto producto={producto} categorias={categorias} />
            </Col>
          ))
        ) : (
          <Col>
            <div className="text-center py-4">
              <p className="text-muted">
                {textoBusqueda 
                  ? `No se encontraron productos para "${textoBusqueda}"`
                  : "No hay productos disponibles"
                }
              </p>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default Catalogo;


