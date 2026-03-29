import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAuthRoute = createRouteMatcher(["/auth"]);
const isProtectedRoute = createRouteMatcher([
  "/",
  "/chat(.*)",
  "/startups(.*)",
]);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const isAuthenticated = await convexAuth.isAuthenticated();

    if (isAuthRoute(request) && isAuthenticated) {
      return nextjsMiddlewareRedirect(request, "/startups");
    }

    if (isProtectedRoute(request) && !isAuthenticated) {
      return nextjsMiddlewareRedirect(request, "/auth");
    }
  },
  {
    cookieConfig: {
      maxAge: 60 * 60 * 24 * 30,
    },
  },
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
