import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { withSwal } from "react-sweetalert2";

function Categorias({ swal }) {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

    const fetchCategories = useCallback(async () => {
        try {
            const result = await axios.get('/api/categorias');
            setCategories(result.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const saveCategory = async (ev) => {
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(',')
            }))
        };

        try {
            if (editedCategory) {
                data._id = editedCategory._id;
                await axios.put('/api/categorias', data);
                setEditedCategory(null);
            } else {
                await axios.post('/api/categorias', data);
            }
            setName('');
            setParentCategory('');
            setProperties([]);
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({ name, values }) => ({
            name,
            values: values.join(',')
        })));
    };

    const deleteCategory = async (category) => {
        const result = await swal.fire({
            title: 'Estas seguro',
            text: `Quieres eliminar ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, eliminar!',
            confirmButtonColor: '#d55',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete('/api/categorias?_id=' + category._id);
                fetchCategories();
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const addProperty = () => setProperties(prev => [...prev, { name: '', values: '' }]);
    const handlePropertyChange = (index, type, newValue) => setProperties(prev => prev.map((property, idx) => idx === index ? { ...property, [type]: newValue } : property));
    const removeProperty = (indexToRemove) => setProperties(prev => prev.filter((_, idx) => idx !== indexToRemove));


    return (
        <Layout>
            <h1>Categorias</h1>
            <label>{editedCategory ? `Editar categoria ${editedCategory.name}` : 'Nuevo nombre de categoria'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input type="text" placeholder={'Nombre de la categoria'} onChange={ev => setName(ev.target.value)} value={name} />
                    <select
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory}

                    >
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Propiedades</label>
                    <button onClick={addProperty} type="button" className="btn-default text-sm mb-2"> Agregar nueva propiedad</button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-1 mb-2"> {/* No se recomienda usar index como key si la lista es dinámica */}
                            <input
                                className="mb-0"
                                type="text"
                                value={property.name}
                                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                placeholder="Nombre de la propiedad (ejemp: Diamante)" />
                            <input
                                className="mb-0"
                                type="text"
                                value={property.values}
                                onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                                placeholder="values, comma separated" />
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
                            setProperties([]);
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
                        {categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button onClick={() => editCategory(category)} className="btn-primary mr-1">Editar</button>
                                    <button onClick={() => deleteCategory(category)} className="btn-primary">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout>
    )

}

export default withSwal(({ swal }, ref) => (
    <Categorias swal={swal} />
));