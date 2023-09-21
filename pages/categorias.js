import Layout from "@/components/layout";
import { Category } from "@/models/Category";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categorias(){
    const [name,setName] = useState('');
    const [categories,setCategories] = useState([]);
    useEffect(() => {
        fetchCategories
    }, [])
    function fetchCategories(){
        axios.get('/api/categorias').then(result => {
            setCategories(result.data);
        });
    }
    async function saveCategory(ev){
        ev.preventDefault();
        await axios.post('/api/categorias',{name})
        setName('');
    }
    return (
        <Layout>
            <h1>Categorias</h1>
            <label>Nuevo nombre de categoria</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input className="mb-0" type="text" placeholder={'Nombre de la categoria'} onChange={ev => setName(ev.target.value)} value={name}/>
                <select>
                    <option value="0">No parent category</option>
                </select>
                <button type="submit" className="btn-primary py-1">
                    Guardar
                </button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Nombre de la categoria</td>
                    </tr>
                </thead>
                <tbody>
                   {categories.length > 0 && categories.map(Category => (
                    <tr>
                        <td>{Category.name}</td>
                    </tr>
                   ))} 
                </tbody>
            </table>
        </Layout>
    )
}