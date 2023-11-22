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
                        <tr>
                            <td>{order.createdAt}</td>
                            <td>
                                {order.name} {order.email}<br/>
                                {order.city} {order.postalCode}
                                {order.streetAddress}<br/>
                            </td>
                            <td>
                                {order.line_items.map(l => (
                                    <>
                                        {l.price_data?.product_data.name}x
                                        {l.quantity}<br/>
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}