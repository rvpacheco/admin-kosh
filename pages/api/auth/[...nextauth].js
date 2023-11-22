import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const adminEmails = ['rvpacheco17@gmail.com', 'koshcolombia@gmail.com'];

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
    session: async ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      }
      return null; // En lugar de false, para seguir las convenciones de NextAuth
    }
  }
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res, next) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!adminEmails.includes(session?.user?.email)) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    next(); // Continuar con la siguiente middleware si es admin
  } catch (error) {
    // Manejar los errores adecuadamente
    return res.status(500).json({ message: 'Internal server error' });
  }
}
