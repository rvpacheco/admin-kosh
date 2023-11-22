import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [weight, setWeight] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [goldPrices, setGoldPrices] = useState({});
  const [priceTypes, setPriceTypes] = useState([]);

  useEffect(() => {
    axios.get("/api/categorias").then((result) => {
      setCategories(result.data);
    });

    // Obtener los precios de oro del servidor
    axios.get("/api/getPrices").then((result) => {
      setGoldPrices(result.data);
      setPriceTypes(Object.keys(result.data));
    });
  }, []);
  useEffect(() => {
    if (weight && selectedPrice && goldPrices[selectedPrice]) {
      const calculatedPrice = parseFloat(weight) * parseFloat(goldPrices[selectedPrice]);
      setPrice(calculatedPrice);
    }
  }, [weight, selectedPrice, goldPrices]);


  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price, images, category, properties: productProperties };
    if (_id) {
      //update

      await axios.put('/api/products', { ...data, _id });
    } else {
      //create

      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
    try {
      console.log("Weight:", weight);
      console.log("Gold Price:", goldPrices[selectedPrice]);

      const multiplicacion = parseFloat(weight) * parseFloat(goldPrices[selectedPrice]);
      console.log("Multiplicacion:", multiplicacion);

      setPrice(multiplicacion);
      console.log("Precio después de la multiplicación:", multiplicacion);

      // Resto del código...
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  }



  const router = useRouter();

  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => [...oldImages, ...res.data.links]);
      setIsUploading(false);
    }
  }

  function updateImagesOrder(newImages) {
    setImages(newImages);
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => ({ ...prev, [propName]: value }));
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Nombre de producto</label>
      <input type="text" placeholder="Nombre del producto" value={title} onChange={(ev) => setTitle(ev.target.value)} />
      <label>Categoría</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Sin categorizar</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      {propertiesToFill.map((p) => (
        <div key={p.name} className="flex gap-1">
          <div>{p.name}</div>
          <select value={productProperties[p.name]} onChange={(ev) => setProductProp(p.name, ev.target.value)}>
            {p.values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      ))}
      <label>Fotos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable list={images} className="flex flex-wrap gap-1" setList={updateImagesOrder}>
          {images.map((link) => (
            <div key={link} className="h-24">
              <img src={link} alt="" />
            </div>
          ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24">
            <Spinner />
          </div>
        )}
        <label className="w-32 h-32 cursor-pointer border text-center flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>Subir</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      <label>Descripción</label>
      <textarea placeholder="Descripción" value={description} onChange={(ev) => setDescription(ev.target.value)} />
      <label>Tipo de Oro</label>
      <select value={selectedPrice} onChange={(ev) => setSelectedPrice(ev.target.value)}>
        <option value="">Seleccionar</option>
        {priceTypes.map((priceType) => (
          <option key={priceType} value={priceType}>
            {priceType}
          </option>
        ))}
      </select>
      <label>Peso</label>
      <input type="number" placeholder="Peso" value={weight} onChange={(ev) => setWeight(ev.target.value)} />
      <label>Precio</label>
      <input type="hidden" value={price} name="price" />
      <div className="price-display">
        <label>Precio</label>
        <span>{price ? `$${price.toFixed(2)}` : 'Calculando...'}</span>
      </div>
      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
  );
}
