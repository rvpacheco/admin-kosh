import Layout from "@/components/layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [oroNacional, setOroNacional] = useState("");
  const [oroItaliano, setOroItaliano] = useState("");
  const [oroPiercing, setOroPiercing] = useState("");
  const [oroEspecial, setOroEspecial] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [Prices, setPrices] = useState({});

  const toggleEditForm = () => {
    setShowEditForm(!showEditForm);
  };


  useEffect(() => {
    axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });

    axios.get("/api/getPrices").then((response) => {
      setPrices(response.data);
    }).catch((error) => console.error("Error fetching prices:", error));
    
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case "nacional":
        setOroNacional(value);
        break;
      case "italiano":
        setOroItaliano(value);
        break;
      case "piercing":
        setOroPiercing(value);
        break;
      case "especial":
        setOroEspecial(value);
        break;
      default:
        break;
    }
  };

  const handleSavePrices = async (e) => {
    e.preventDefault();

    // Puedes usar oroNacional, oroItaliano, oroPiercing, oroEspecial
    // para enviar la información al servidor o realizar otras acciones.

    // Ejemplo:
    await axios.post('/api/savePrices', {
      nacional: oroNacional,
      italiano: oroItaliano,
      piercing: oroPiercing,
      especial: oroEspecial,
    });

    console.log("Precios guardados exitosamente:", {
      nacional: oroNacional,
      italiano: oroItaliano,
      piercing: oroPiercing,
      especial: oroEspecial,
    });
  };

  return (
    <Layout>
      <Link className="btn-primary" href={"/products/new"}>
        Agrega un nuevo producto
      </Link>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Nombre del producto</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td>
                <Link href={"/products/edit/" + product._id}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Editar
                </Link>
                <Link href={"/products/delete/" + product._id}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  Eliminar
                </Link>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <button onClick={toggleEditForm} className="btn-primary">
                Editar Precios de Oro
              </button>
              {/* Displaying the current prices */}
              <div className="current-prices">
                <p>Nacional: {Prices.nacional}</p>
                <p>Italiano: {Prices.italiano}</p>
                <p>Piercing: {Prices.piercing}</p>
                <p>Especial: {Prices.especial}</p>
              </div>
              {showEditForm && (
                <form>
                  {/* ... existing form elements */}
                  <button type="submit" className="btn-primary" onClick={handleSavePrices}>
                    Guardar
                  </button>
                  
                  <div>
                    <label htmlFor="nacional">Nacional:</label>
                    <input type="text" id="nacional" onChange={handleInputChange} value={oroNacional} />
                  </div>
                  <div>
                    <label htmlFor="italiano">Italiano:</label>
                    <input type="text" id="italiano" onChange={handleInputChange} value={oroItaliano} />
                  </div>
                  <div>
                    <label htmlFor="piercing">Piercing:</label>
                    <input type="text" id="piercing" onChange={handleInputChange} value={oroPiercing} />
                  </div>
                  <div>
                    <label htmlFor="especial">Especial:</label>
                    <input type="text" id="especial" onChange={handleInputChange} value={oroEspecial} />
                  </div>
                  <button type="button" className="btn-secondary" onClick={toggleEditForm}>
                    Cerrar
                  </button>
                </form>
              )}
            </td>
          </tr>
        </tbody>
      </table>

    </Layout>
  );
}
