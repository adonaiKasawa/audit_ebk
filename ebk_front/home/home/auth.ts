import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

import { authSigninUser, refreshAccessToken } from "./app/lib/actions/auth";
import { PayloadUserInterface } from "./app/lib/config/interface";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ telephone: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { telephone, password } = parsedCredentials.data;
          const user = await authSigninUser({ telephone, password });

          if (user) return user;

          return null;
        }

        return null;
      },
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
    }),
  ],
  callbacks: {
    // authorized({ auth, request: { nextUrl } }) {
    //   // const isLoggedIn = !!auth?.user;
    //   // const isOnDashboard = nextUrl.pathname.startsWith('/');
    //   // if (isOnDashboard) {
    //   //   if (isLoggedIn) return true;
    //   //   return false;
    //   // } else if (isLoggedIn) {
    //   //   return Response.redirect(new URL('/', nextUrl));
    //   // }
    //   return true;
    // },
    async jwt({ token, user, trigger, session }) {
      const newUser: any = user;
      const time = moment().unix();

      if (trigger === "update") {
        return Promise.resolve({ ...token, ...session.user });
      }
      if (user) {
        token.access_token = `${newUser?.access_token}`;
        token.refresh_token = `${newUser?.refresh_token}`;
      } else {
        if (token) {
          let jwt_decode: PayloadUserInterface = jwtDecode(
            `${token?.access_token}`,
          );

          if (jwt_decode.exp < time) {
            const rt = await refreshAccessToken({
              access_token: `${token.access_token}`,
              refresh_token: `${token.refresh_token}`,
            });

            if (rt) {
              token.token = {
                access_token: rt.access_token,
                refresh_token: rt.refresh_token,
              };
              jwt_decode = jwtDecode(`${token?.access_token}`);

              return token;
            }
          }
        }
      }

      return Promise.resolve(token);
    },
    async session({ token, session }) {
      const newSession = session;
      const newToken = token;

      newSession.user = jwtDecode(`${newToken.access_token}`);
      newSession.token = {
        access_token: `${token.access_token}`,
        refresh_token: `${token.refresh_token}`,
      };

      return Promise.resolve(newSession);
    },
  },
 cookies: {
  sessionToken: {
  name: `__Secure-next-auth.session-token`,
  options: {
  httpOnly: true,
  sameSite: "none", // Utilisez 'None' si vous gérez bien le CORS
  path: "/",
  secure: true,
  domain: ".ecclesiabook.org", // Important pour le partage entre sous-domaines
      },
    },
},
  session: {
    strategy: "jwt",
  },
  secret: "H6llI7z4ITzGub+reOy6qc+F0m27OXu/h2M6q34zdKw=",
  trustHost: true,
});
