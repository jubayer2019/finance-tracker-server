import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";

const protect = async (req, res, next) => {
  try {
    // Convert Node incoming headers array into standard Headers interface
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: "Not authorized, session invalid" });
    }

    // Attach verified session entity onto processing context request blocks
    req.user = session.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication validation error occurance" });
  }
};

export { protect };