import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form, Alert } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import TablaProductos from "../components/productos/TablaProductos";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import CuadroBusquedas from "../components/busqueda/CuadroBusquedas";

const Productos = () => {
  // ESTADOS DE AUTENTICACIÓN
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // CONTRASEÑA DE ADMINISTRADOR - ¡CÁMBIALA POR UNA SEGURA!
  const ADMIN_PASSWORD = "marlene18";

  // Estados existentes de tu componente
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const productosCollection = collection(db, "productos");
  const categoriasCollection = collection(db, "categorias");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  // Estados para manejo del modal de registro
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: null,
    Raza: null,
    categoria: "",
    imagen: "",
  });

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Estado para el modal de edición
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("adminAuth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
    cargarProductos();
    cargarCategorias();
  }, []);

  // FUNCIONES DE AUTENTICACIÓN
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setShowLoginModal(false);
      setPassword("");
    } else {
      setError("❌ Contraseña incorrecta");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
  };

  // FUNCIONES PROTEGIDAS
  const abrirModalAgregarProtegido = () => {
    if (isAuthenticated) {
      setMostrarModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const manejarEditarProtegido = (producto) => {
    if (isAuthenticated) {
      setProductoEditado({ ...producto });
      setMostrarModalEditar(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const manejarEliminarProtegido = (producto) => {
    if (isAuthenticated) {
      setProductoAEliminar(producto);
      setMostrarModalEliminar(true);
    } else {
      setShowLoginModal(true);
    }
  };

  // FUNCIONES EXISTENTES (sin cambios)
  const manejoCambioInputEditar = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) || 0 : value,
    }));
  };

  const editarProducto = async () => {
    if (
      !productoEditado?.nombre ||
      !productoEditado?.descripcion ||
      !productoEditado?.precio ||
      !productoEditado?.Raza ||
      !productoEditado?.categoria
    ) {
      alert("Por favor, completa todos los campos antes de actualizar.");
      return;
    }
    setMostrarModalEditar(false);
    try {
      const productoRef = doc(db, "productos", productoEditado.id);
      await updateDoc(productoRef, {
        nombre: productoEditado.nombre,
        descripcion: productoEditado.descripcion,
        precio: productoEditado.precio,
        Raza: productoEditado.Raza,
        categoria: productoEditado.categoria,
        imagen: productoEditado.imagen,
      });
      cargarProductos();
      console.log("Producto actualizado exitosamente.");
      setProductoEditado(null);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Error al actualizar el producto: " + error.message);
    }
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) || 0 : value,
    }));
  };

  const agregarProducto = async () => {
    if (
      !nuevoProducto.nombre ||
      !nuevoProducto.descripcion ||
      !nuevoProducto.precio ||
      !nuevoProducto.Raza ||
      !nuevoProducto.categoria
    ) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }
    setMostrarModal(false);
    try {
      await addDoc(productosCollection, nuevoProducto);
      setNuevoProducto({
        nombre: "",
        descripcion: "",
        precio: null,
        Raza: null,
        categoria: "",
        imagen: "",
      });
      cargarProductos();
      console.log("Producto agregado exitosamente.");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("Error al agregar el producto: " + error.message);
    }
  };

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

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    try {
      const productoRef = doc(db, "productos", productoAEliminar.id);
      await deleteDoc(productoRef);
      cargarProductos();
      console.log("Producto eliminado exitosamente.");
      setMostrarModalEliminar(false);
      setProductoAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Error al eliminar el producto: " + error.message);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = productos.filter((producto) => {
      const nombreCat =
        categorias.find((c) => c.id === producto.categoria)?.nombre || "";
      return (
        producto.nombre.toLowerCase().includes(texto) ||
        producto.descripcion.toLowerCase().includes(texto) ||
        nombreCat.toLowerCase().includes(texto) ||
        producto.precio.toString().includes(texto) ||
        producto.stock.toString().includes(texto)
      );
    });
    setProductosFiltrados(filtrados);
  };

  return (
    <Container className="mt-4">
      {/* HEADER CON ESTADO DE AUTENTICACIÓN */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Gestión de Productos</h4>
        {isAuthenticated ? (
          <div className="d-flex align-items-center gap-3">
            <span className="text-success fw-bold">✅ Modo Administrador</span>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        ) : (
          <Button
            variant="outline-warning"
            onClick={() => setShowLoginModal(true)}
          >
            🔒 Acceso Administrador
          </Button>
        )}
      </div>

      <Row>
        <Col lg={3} md={4} sm={4} xs={5}>
          {/* BOTÓN PROTEGIDO - SOLO VISIBLE PARA AUTENTICADOS */}
          {isAuthenticated ? (
            <Button
              className="mb-3"
              onClick={abrirModalAgregarProtegido}
              style={{ width: "100%" }}
            >
              Agregar producto
            </Button>
          ) : (
            <Alert variant="info" className="mb-3 p-2 text-center">
              <small>Inicia sesión para agregar productos</small>
            </Alert>
          )}
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

      {/* TABLA CON FUNCIONES PROTEGIDAS */}
      <TablaProductos
        productos={productosFiltrados}
        categorias={categorias}
        manejarEliminar={manejarEliminarProtegido}
        manejarEditar={manejarEditarProtegido}
      />

      {/* MODALES - SOLO FUNCIONAN SI ESTÁ AUTENTICADO */}
      {isAuthenticated && (
        <>
          <ModalRegistroProducto
            mostrarModal={mostrarModal}
            setMostrarModal={setMostrarModal}
            nuevoProducto={nuevoProducto}
            manejoCambioInput={manejoCambioInput}
            agregarProducto={agregarProducto}
            categorias={categorias}
          />

          <ModalEliminacionProducto
            mostrarModalEliminar={mostrarModalEliminar}
            setMostrarModalEliminar={setMostrarModalEliminar}
            productoAEliminar={productoAEliminar}
            eliminarProducto={eliminarProducto}
          />

          <ModalEdicionProducto
            mostrarModalEditar={mostrarModalEditar}
            setMostrarModalEditar={setMostrarModalEditar}
            productoEditado={productoEditado}
            manejoCambioInputEditar={manejoCambioInputEditar}
            editarProducto={editarProducto}
            categorias={categorias}
          />
        </>
      )}

      {/* MODAL DE LOGIN */}
      <Modal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title>🔐 Autenticación Requerida</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">
            Esta acción requiere permisos de administrador.
          </p>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña de Administrador</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña de administrador"
                required
                autoFocus
              />
              {error && <div className="text-danger mt-2">{error}</div>}
            </Form.Group>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowLoginModal(false)}
              >
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Verificar y Acceder
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Productos;
