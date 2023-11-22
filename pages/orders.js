import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders,setOrders] = useState([]);
    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        });
    },[]);
    return (
        <Layout>
            <h1>orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Destinatario</th>
                        <th>Producto</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}> {/* Asegúrate de que `order` tiene una propiedad `_id` única */}
                            <td>{order.createdAt}</td>
                            <td>
                                {order.name} {order.email}<br/>
                                {order.city} {order.postalCode}
                                {order.streetAddress}<br/>
                            </td>
                            <td>
                                {order.line_items.map((l, index) => (
                                    // Envuelve los elementos en un div o fragmento con una key
                                    <div key={index}> {/* Idealmente usa un identificador único si lo hay */}
                                        {l.price_data?.product_data.name}x
                                        {l.quantity}<br/>
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}