import { admin } from "@/config/firebase";
import { db } from "@/db/db-pgp";
import type { NextFunction, Request, Response } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";

/**
 * Verifies the access token attached to the request's cookies.
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cookies } = req;

    if (!cookies.accessToken) {
      return res.status(400).send("@verifyToken invalid access token");
    }

    const decodedToken = await admin.auth().verifyIdToken(cookies.accessToken);

    // this should not happen!
    if (!decodedToken) {
      return res.status(400).send("@verifyToken no decodedToken returned");
    }

    res.locals.decodedToken = decodedToken;

    next();
  } catch (_err) {
    return res.status(400).send("@verifyToken error validating token");
  }
};

/**
 * A higher order function returning a middleware that protects routes based on the user's role.
 * The role "supervisor" can access all routes
 *
 * @param requiredRole a list of roles that can use this route
 */
export const verifyRole = (requiredRole: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== "production") {
      return next();
    }

    try {
      const { cookies } = req;
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

      if (!cookies.accessToken) {
        return res.status(400).send("@verifyToken invalid access token");
      }

      const decodedToken: DecodedIdToken =
        res.locals.decodedToken ??
        (await admin.auth().verifyIdToken(cookies.accessToken));

      const users = await db.query(
        "SELECT * FROM users WHERE firebase_uid = $1 LIMIT 1",
        [decodedToken.uid]
      );

      const dbRole = users.at(0)?.role as CanonicalRole | undefined;
      const allowedRoles = expandAllowedRoles(roles as CanonicalRole[]);

      // supervisors can access all protected routes
      if (dbRole === "supervisor" || (dbRole !== undefined && allowedRoles.includes(dbRole))) {
        next();
      } else {
        res
          .status(403)
          .send(`@verifyRole invalid role (required: ${requiredRole})`);
      }
    } catch (_err) {
      res.status(401).send("@verifyRole could not verify role");
    }
  };
};

type CanonicalRole = "guest" | "volunteer" | "staff" | "supervisor";

// allows higher roles to access everything a lower role can access
function expandAllowedRoles(required: Array<CanonicalRole | undefined>): CanonicalRole[] {
  // role hierarchy: guest < volunteer < staff < supervisor
  const rank: Record<CanonicalRole, number> = {
    guest: 0,
    volunteer: 1,
    staff: 2,
    supervisor: 3,
  };

  const minRank = Math.min(
    ...required
      .filter((r): r is CanonicalRole => r !== undefined)
      .map((r) => rank[r])
  );

  // if nothing valid specified, default to "staff" behavior by requiring auth but no role filter
  if (!Number.isFinite(minRank)) return ["guest", "volunteer", "staff", "supervisor"];

  return (Object.keys(rank) as CanonicalRole[]).filter((r) => rank[r] >= minRank);
}
