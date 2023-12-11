import Layout from "@/components/layout";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? 'Invitado';
  const userImage = session?.user?.image ?? '/default-profile.png'; // Asumiendo que tienes una imagen predeterminada

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>qlq manin, {userName}</h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg">
          <Image src={userImage} alt={`Imagen de perfil de ${userName}`} className="w-6 h-6" />
          <span className="px-2">{userName}</span>
        </div>      
      </div>
    </Layout>
  );
}
