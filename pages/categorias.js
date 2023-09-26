import Layout from "@/components/layout";
import { Category } from "@/models/Category";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categorias({swal}){
    
    const [editedCategory,setEditedCategory] = useState(null);
    const [name,setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories,setCategories] = useState([]);
    const [properties,setProperties] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, [])
    function fetchCategories(){
        axios.get('/api/categorias').then(result => {
            setCategories(result.data);
        });
    }
    async function saveCategory(ev){
        ev.preventDefault();
        const data = {name,parentCategory ,properties: properties.map(p => ({
            name:p.name,
            values:p.values.split(','),
        }))}
        if(editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categorias', data);
            setEditedCategory(null);
            
        }else {
            await axios.post('/api/categorias',data);
        }
        setName('');
        setParentCategory('')
        setProperties([])
        fetchCategories();
    }
    function editCategory(Category){
        setEditedCategory(Category);
        setName(Category.name);
        setParentCategory(Category.parent?._id);
    }

    function deleteCategory(Category){
        swal.fire({
            title: 'Estas seguro',
            text : `Quieres eliminar ${Category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, eliminar!',
            confirmButtonColor:'#d55',
        }).then(async result => {
            if (result.isConfirmed){
                const {_id} = Category;
                await axios.delete('/api/categorias?_id='+_id);
                fetchCategories();
            }
        });
    }
    function addProperty() {
        setProperties(prev => {
        return [...prev,{name:'',values: ''}]
        });
    }
    function handlePropertyNameChange(index,property,newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }
    function handlePropertyValuesChange(index,property,newValues){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });

    }
    function removeProperty(indexToRemove){
        setProperties(prev => {
            
            return [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    };
    
    return (
        <Layout>
            <h1>Categorias</h1>
            <label>{editedCategory ? `Editar categoria ${editedCategory.name}` : 'Nuevo nombre de categoria'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input type="text" placeholder={'Nombre de la categoria'} onChange={ev => setName(ev.target.value)} value={name}/>
                    <select 
                    onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}
                    
                    >
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(Category => (
                            <option value={Category._id}>{Category.name}</option>
                    ))} 
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Propiedades</label>
                    <button onClick={addProperty} type="button" className="btn-default text-sm mb-2"> Agregar nueva propiedad</button>
                    {properties.length > 0 && properties.map((property,index) => (
                        <div className="flex gap-1 mb-2">
                            <input 
                            className="mb-0" 
                            type="text" 
                            value={property.name}
                            onChange={ ev => handlePropertyNameChange(index,property,ev.target.value)} 
                            placeholder="Nombre de la propiedad (ejemp: Diamante)"/>
                            <input 
                            className="mb-0" 
                            type="text" 
                            value={property.values} 
                            onChange={ev => handlePropertyValuesChange(index,property,ev.target.value)} 
                            placeholder="values, comma separated"/>
                            <button 
                            onClick={() => removeProperty(index)}
                            type="button"
                            className="btn-default">
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                {editedCategory && (
                    <button type="button" onClick={() => {
                        setEditedCategory(null);
                        setName('');
                        setParentCategory('')
                    }} 
                        className="btn-default">
                        Cancelar
                    </button>
                )}
                
                <button type="submit" className="btn-primary py-1">
                    Guardar
                </button>
                </div>
                
            </form>
            {!editedCategory && (
                <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Nombre de la categoria</td>
                        <td>Categorias relacionada</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                   {categories.length > 0 && categories.map(Category => (
                    <tr>
                        <td>{Category.name}</td>
                        <td>{Category?.parent?.name}</td>
                        <td>
                            <button onClick={() => editCategory(Category)} className="btn-primary mr-1">Editar</button>
                            <button onClick={() => deleteCategory(Category)} className="btn-primary">Eliminar</button>
                        </td>
                    </tr>
                   ))} 
                </tbody>
            </table>
            )}
        </Layout>
    )

}

export default  withSwal(({swal}, ref) => (
    <Categorias swal={swal}/>
) );