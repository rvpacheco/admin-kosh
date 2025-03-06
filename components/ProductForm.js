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
  weight: existingWeight, // Añadir el peso existente
  goldType: existingGoldType, // Añadir el tipo de oro existente
  
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
  const [weight, setWeight] = useState(existingWeight || ""); // Inicializa con el peso existente
  const [selectedPrice, setSelectedPrice] = useState(existingGoldType || ""); // Inicializa con el tipo de oro existente

  const [goldPrices, setGoldPrices] = useState({});
  const [priceTypes, setPriceTypes] = useState([]);
    const [sizes, setSizes] = useState({});


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
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
      weight, // Incluir el peso en los datos enviados
      goldType: selectedPrice, // Incluir el tipo de oro en los datos enviados
      sizes,

    };
    if (_id) {
      // update
      await axios.put('/api/products', { ...data, _id });
    } else {
      // create
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
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

  function removeImage(imageUrl) {
    setImages((prevImages) => prevImages.filter((image) => image !== imageUrl));
  }

  function updateSizes(talla, cantidad) {
    setSizes((prev) => ({ ...prev, [talla]: cantidad }));
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
            <div key={link} className="relative h-24 w-24">
              <img src={link} alt="" className="w-full h-full object-cover rounded-md" />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
                onClick={() => removeImage(link)}
              >
                ✕
              </button>
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
      <label className="font-semibold">Tallas disponibles</label>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(10).keys()].map((i) => (
          <div key={i + 1} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
            <span className="text-sm font-medium">Talla {i + 1}:</span>
            <input type="number" min="0" value={sizes[i + 1] || ""} onChange={(ev) => updateSizes(i + 1, ev.target.value)} className="w-16 p-1 border rounded" />
          </div>
        ))}
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
