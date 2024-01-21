import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/shop") && token === null) {
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
