


// const jwt = require('jsonwebtoken');

// // Auth middleware: Verify JWT token and attach user info
// const isAuth = (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ message: "Authentication token is missing" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     req.userRole = decoded.role;
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

// // Role-based guards
// const isWasherman = (req, res, next) => {
//   if (req.userRole !== 'washerman') {
//     return res.status(403).json({ message: "Washerman access only" });
//   }
//   next();
// };

// const isCustomer = (req, res, next) => {
//   if (req.userRole !== 'customer') {
//     return res.status(403).json({ message: "Customer access only" });
//   }
//   next();
// };

// module.exports = { isAuth, isWasherman, isCustomer };






// const jwt = require('jsonwebtoken');

// const isAuth = (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ message: "No token provided" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     req.userRole = decoded.role;
//     next();
//   } catch (err) {
//     res.status(403).json({ message: "Unauthorized" });
//   }
// };

// // Role check middleware
// const isWasherman = (req, res, next) => {
//   if (req.userRole !== 'washerman') return res.status(403).json({ message: "Washerman access only" });
//   next();
// };

// const isCustomer = (req, res, next) => {
//   if (req.userRole !== 'customer') return res.status(403).json({ message: "Customer access only" });
//   next();
// };

// module.exports = { isAuth, isWasherman, isCustomer };


















// const jwt = require('jsonwebtoken');

// const isAuth = (req, res, next) => {
//   try {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
//       token = req.headers.authorization.split(" ")[1];
//     } else if (req.cookies.token) {
//       token = req.cookies.token;
//     }

//     if (!token) return res.status(401).json({ message: "No token provided" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ FIXED: Support either `userId` or `id`
//     req.userId = decoded.userId || decoded.id;
//     req.userRole = decoded.role;

//     next();
//   } catch (err) {
//     res.status(403).json({ message: "Unauthorized", error: err.message });
//   }
// };

// const isWasherman = (req, res, next) => {
//   if (req.userRole !== 'washerman') return res.status(403).json({ message: "Washerman access only" });
//   next();
// };

// const isCustomer = (req, res, next) => {
//   if (req.userRole !== 'customer') return res.status(403).json({ message: "Customer access only" });
//   next();
// };

// const isAdmin = (req, res, next) => {
//   if (req.userRole !== 'admin') return res.status(403).json({ message: "Admin access only" });
//   next();
// };

// module.exports = { isAuth, isWasherman, isCustomer, isAdmin };





const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  try {
    let token;

    // ✅ 1. Extract token from header or cookies
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // ❌ No token found
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 3. Attach user info to request
    req.userId = decoded.userId || decoded.id; // Flexible decoding
    req.userRole = decoded.role;

    next();
  } catch (err) {
    return res.status(403).json({
      message: "Unauthorized",
      error: err.message || "Invalid token"
    });
  }
};

// ✅ Role-based middleware
const isWasherman = (req, res, next) => {
  if (req.userRole !== 'washerman') {
    return res.status(403).json({ message: "Access restricted to washermen only" });
  }
  next();
};

const isCustomer = (req, res, next) => {
  if (req.userRole !== 'customer') {
    return res.status(403).json({ message: "Access restricted to customers only" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Access restricted to admins only" });
  }
  next();
};

module.exports = { isAuth, isWasherman, isCustomer, isAdmin };
