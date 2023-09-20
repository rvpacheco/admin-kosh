import { useState } from "react"
import { useRouter } from "next/router" 
import axios from "axios"


export default function ProductForm({
    _id,
    title:existingTitle,
    description: existingDescription,
    price: existingPrice
}){
    const [title,setTitle] = useState(existingTitle || '')
    const [description,setDescription] = useState(existingDescription || '')
    const [price,setPrice] = useState(existingPrice || '')
    const [goToProducts, setGoToProducs] = useState(false)
    const router = useRouter();
    async function SaveProduct(ev) {
        ev.preventDefault();
        const data = {title,description,price};
        if (_id){
            //update
            
            await axios.put('/api/products',{...data,_id});
        }else{
            //create
            
            await axios.post('/api/products', data);
        }
        setGoToProducs(true);
        
    }
    if (goToProducts) {
        router.push('/products');
    }
    return (
            <form onSubmit={SaveProduct}>

                <label>Nombre de producto</label>
                <input 
                    type="text" 
                    placeholder="product name"
                    value={title}
                    onChange={ev => setTitle(ev.target.value)}/>
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