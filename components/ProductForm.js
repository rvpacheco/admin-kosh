import { useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import Spinner from "./Spinner"


export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
}) {
    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [price, setPrice] = useState(existingPrice || '')
    const [images,setImages] = useState(existingImages || [])
    const [goToProducts, setGoToProducs] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter();
    async function SaveProduct(ev) {
        ev.preventDefault();
        const data = { title, description, price, images };
        if (_id) {
            //update

            await axios.put('/api/products', { ...data, _id });
        } else {
            //create

            await axios.post('/api/products', data);
        }
        setGoToProducs(true);

    }
    if (goToProducts) {
        router.push('/products');
    }
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }
    return (
        <form onSubmit={SaveProduct}>
            <label>Nombre de producto</label>
            <input
                type="text"
                placeholder="product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)} />
            <label>
                fotos
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
                {!!images?.length && images.map(link => (
                    <div key={link} className="h-24">
                        <img src={link} alt="" />
                    </div>
                ))}
                {isUploading && (
                    <div className="h-24">
                        <Spinner/>
                    </div>
                )}
                <label className="w-32 h-32 cursor-pointer border text-center flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Subir
                    </div>
                    <input type="file" onChange={uploadImages} className="hidden"/>

                </label>
            </div>
            <label>Descripcion</label>
            <textarea
                placeholder="Description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />
            <label>Precio</label>
            <input
                type="number" placeholder="Precio"
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />
            <button type="submit" className="btn-primary">Guardar</button>

        </form>

    );
}