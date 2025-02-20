import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const adminEmails = ['rvpacheco17@gmail.com', 'koshcolombia@gmail.com', 'maria.alejandra.olarte@gmail.com'];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session }) => adminEmails.includes(session?.user?.email) ? session : null
  }
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!adminEmails.includes(session?.user?.email)) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    // Si es un admin, simplemente continua la ejecución (no hay 'next' en Next.js API routes)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
