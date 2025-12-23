import NextAuth, { type NextAuthConfig } from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';

// Validate required environment variables
const requiredEnvVars = {
  AUTH_MICROSOFT_ENTRA_ID_ID: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
  AUTH_MICROSOFT_ENTRA_ID_SECRET: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
  AUTH_MICROSOFT_ENTRA_ID_ISSUER: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  );
}

// Debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('Microsoft Entra ID Configuration:');
  console.log(
    '- Client ID:',
    process.env.AUTH_MICROSOFT_ENTRA_ID_ID ? 'Set' : 'Missing'
  );
  console.log(
    '- Client Secret:',
    process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET ? 'Set' : 'Missing'
  );
  console.log(
    '- Issuer:',
    process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER ? 'Set' : 'Missing'
  );
}

const config: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // AzureADProvider({
    //   clientId: process.env.AZURE_AD_CLIENT_ID!,
    //   clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
    //   authorization: {
    //     params: {
    //       scope: 'openid profile email User.Read',
    //     },
    //   },
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: profile.name,
    //       email: profile.email,
    //       image: (profile as any).picture || undefined,
    //     };
    //   },
    // }),
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: (profile as { picture?: string }).picture || undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      try {
        if (account && profile) {
          token.accessToken = account.access_token;
          token.idToken = account.id_token;
          token.role = (profile as { role?: string }).role || 'user';
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (token) {
          (session as { accessToken?: string; idToken?: string; user: { role?: string } }).accessToken = token.accessToken as string;
          (session as { accessToken?: string; idToken?: string; user: { role?: string } }).idToken = token.idToken as string;
          (session.user as { role?: string }).role = token.role as string;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  events: {
    async signIn({ user, account }) {
      console.log('Sign in event:', {
        user: user.email,
        provider: account?.provider,
      });
    },
    async signOut() {
      console.log('Sign out event');
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
