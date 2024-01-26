import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/") && token === null) {
        return true;
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
