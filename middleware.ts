import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/api") && token === null) {
        return false;
      }
      if (req.nextUrl.pathname.startsWith("/") && token === null) {
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
