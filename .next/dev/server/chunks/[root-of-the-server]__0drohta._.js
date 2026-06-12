module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/prisma.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
}
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[project]/lib/auth.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateToken",
    ()=>generateToken,
    "getUserFromRequest",
    ()=>getUserFromRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
const jwtSecret = process.env.JWT_SECRET || (("TURBOPACK compile-time truthy", 1) ? "your-secret-key" : "TURBOPACK unreachable");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const generateToken = (userId, email, role)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
        userId,
        email,
        role
    }, jwtSecret, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });
const getUserFromRequest = (req)=>{
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            error: {
                status: 401,
                message: "Token tidak ditemukan"
            }
        };
    }
    const token = authHeader.slice(7);
    try {
        const user = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, jwtSecret);
        return {
            user
        };
    } catch (error) {
        if (error?.name === "TokenExpiredError") {
            return {
                error: {
                    status: 401,
                    message: "Token sudah kadaluarsa"
                }
            };
        }
        return {
            error: {
                status: 401,
                message: "Token tidak valid"
            }
        };
    }
};
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/lib/cloudinary.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteCloudinaryImage",
    ()=>deleteCloudinaryImage,
    "uploadImageBuffer",
    ()=>uploadImageBuffer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cloudinary/cloudinary.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$stream__$5b$external$5d$__$28$node$3a$stream$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:stream [external] (node:stream, cjs)");
;
;
const requiredCloudinaryEnv = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
];
const assertCloudinaryConfigured = ()=>{
    const missing = requiredCloudinaryEnv.filter((key)=>!process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Cloudinary environment variables are missing: ${missing.join(", ")}`);
    }
};
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
const uploadImageBuffer = (buffer, options = {})=>new Promise((resolve, reject)=>{
        try {
            assertCloudinaryConfigured();
        } catch (error) {
            reject(error);
            return;
        }
        const upload = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.upload_stream({
            folder: options.folder || "surya-ban/products",
            public_id: options.public_id,
            resource_type: "image"
        }, (error, result)=>{
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$stream__$5b$external$5d$__$28$node$3a$stream$2c$__cjs$29$__["Readable"].from(buffer).pipe(upload);
    });
const deleteCloudinaryImage = async (publicId)=>{
    if (!publicId) return null;
    assertCloudinaryConfigured();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.destroy(publicId, {
        resource_type: "image"
    });
};
}),
"[project]/app/api/[[...path]]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cloudinary.js [app-route] (ecmascript)");
;
;
;
;
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const manualBankInfo = {
    bank: process.env.MANUAL_BANK_NAME || "BCA",
    accountNumber: process.env.MANUAL_BANK_ACCOUNT_NUMBER || "1234567890",
    accountName: process.env.MANUAL_BANK_ACCOUNT_NAME || "PT Surya Ban Nusantara"
};
const supportedPayments = new Set([
    "TRANSFER_BANK",
    "COD"
]);
const supportedStatuses = new Set([
    "UNPAID",
    "COD",
    "WAITING_CONFIRMATION",
    "PAID",
    "CANCELLED"
]);
const productFields = [
    "name",
    "brand",
    "category",
    "description",
    "price",
    "size",
    "width",
    "profile",
    "rim",
    "loadIndex",
    "speedRating",
    "vehicleType",
    "compatibleCars",
    "character",
    "condition",
    "yearProduction",
    "warranty",
    "image",
    "stock",
    "badge",
    "note"
];
const json = (data, init = {})=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, init);
const getPathParts = (req)=>new URL(req.url).pathname.split("/").filter(Boolean).slice(1);
const readJsonBody = async (req)=>{
    try {
        return await req.json();
    } catch  {
        return {};
    }
};
const normalizeProductInput = (body)=>{
    const data = {};
    for (const field of productFields){
        if (Object.hasOwn(body, field)) {
            data[field] = typeof body[field] === "string" ? body[field].trim() : body[field];
        }
    }
    if (Object.hasOwn(data, "price")) {
        data.price = Number(data.price);
    }
    for (const field of productFields){
        if (field !== "price" && data[field] === "") {
            data[field] = null;
        }
    }
    return data;
};
const validateProductInput = (data, partial = false)=>{
    const requiredFields = [
        "name",
        "brand",
        "category",
        "price"
    ];
    if (!partial) {
        for (const field of requiredFields){
            if (!data[field]) {
                return `${field} wajib diisi`;
            }
        }
    }
    if (Object.hasOwn(data, "price") && (!Number.isFinite(data.price) || data.price <= 0)) {
        return "Harga produk tidak valid";
    }
    return null;
};
const buildUniqueConstraintMessage = (error, fallback)=>{
    const field = Array.isArray(error?.meta?.target) ? error.meta.target[0] : null;
    if (field === "name") {
        return "Nama produk sudah digunakan";
    }
    return fallback;
};
const buildMethodLabel = (paymentMethod)=>paymentMethod === "TRANSFER_BANK" ? "Transfer Manual" : "COD";
const createOrderId = ()=>`SB-MANUAL-${Date.now()}-${__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].randomBytes(2).toString("hex").toUpperCase()}`;
const createRefCode = ()=>`REF-${__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].randomBytes(3).toString("hex").toUpperCase()}`;
const getAuthUser = (req)=>{
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserFromRequest"])(req);
    if (auth.error) {
        return auth;
    }
    return {
        user: auth.user
    };
};
const requireAdmin = (user)=>{
    if (user?.role !== "ADMIN") {
        return {
            error: {
                status: 403,
                message: "Akses hanya untuk admin"
            }
        };
    }
    return {
        user
    };
};
const parseNumericId = (value)=>{
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};
const buildOrderInclude = {
    user: {
        select: {
            id: true,
            name: true,
            email: true,
            phone: true
        }
    },
    items: {
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true
                }
            }
        }
    }
};
async function GET(req) {
    const [scope, resource, ...rest] = getPathParts(req);
    if (scope === "health") {
        return json({
            ok: true,
            provider: "manual",
            storage: "postgresql"
        });
    }
    if (scope === "products") {
        try {
            const searchParams = new URL(req.url).searchParams;
            const search = String(searchParams.get("search") || "").trim();
            const category = String(searchParams.get("category") || "").trim();
            const rim = String(searchParams.get("rim") || "").trim();
            const products = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
                where: {
                    ...category && category !== "Semua" ? {
                        category
                    } : {},
                    ...rim && rim !== "Semua Ring" ? {
                        rim
                    } : {},
                    ...search ? {
                        OR: [
                            {
                                name: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                brand: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                size: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                category: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                compatibleCars: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                character: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            }
                        ]
                    } : {}
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            return json({
                count: products.length,
                products
            });
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "auth" && resource === "profile") {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    id: auth.user.userId
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    address: true,
                    role: true,
                    createdAt: true
                }
            });
            if (!user) {
                return json({
                    message: "User tidak ditemukan"
                }, {
                    status: 404
                });
            }
            return json(user);
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "users" && resource) {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        const userId = parseNumericId(resource);
        if (!userId) {
            return json({
                message: "User tidak valid"
            }, {
                status: 400
            });
        }
        if (auth.user.userId !== userId && auth.user.role !== "ADMIN") {
            return json({
                message: "Akses ditolak"
            }, {
                status: 403
            });
        }
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    address: true,
                    role: true,
                    createdAt: true
                }
            });
            if (!user) {
                return json({
                    message: "User tidak ditemukan"
                }, {
                    status: 404
                });
            }
            return json(user);
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "admin" && resource === "users") {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        const admin = requireAdmin(auth.user);
        if (admin.error) return json({
            message: admin.error.message
        }, {
            status: admin.error.status
        });
        try {
            const users = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            return json({
                count: users.length,
                users
            });
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "orders" && !resource) {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        try {
            const where = auth.user.role === "ADMIN" ? {} : {
                userId: auth.user.userId
            };
            const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
                where,
                orderBy: {
                    createdAt: "desc"
                },
                include: buildOrderInclude
            });
            return json({
                count: orders.length,
                orders
            });
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "users" && rest[0] === "orders") {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        const userId = parseNumericId(resource);
        if (!userId) {
            return json({
                message: "User tidak valid"
            }, {
                status: 400
            });
        }
        if (auth.user.userId !== userId && auth.user.role !== "ADMIN") {
            return json({
                message: "Akses ditolak"
            }, {
                status: 403
            });
        }
        try {
            const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
                where: {
                    userId
                },
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true
                                }
                            }
                        }
                    }
                }
            });
            return json({
                count: orders.length,
                orders
            });
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "orders" && resource) {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        try {
            const order = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findUnique({
                where: {
                    orderId: resource
                },
                include: buildOrderInclude
            });
            if (!order) {
                return json({
                    message: "Order tidak ditemukan"
                }, {
                    status: 404
                });
            }
            if (auth.user.userId !== order.userId && auth.user.role !== "ADMIN") {
                return json({
                    message: "Akses ditolak"
                }, {
                    status: 403
                });
            }
            return json(order);
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    return json({
        message: "Route tidak ditemukan"
    }, {
        status: 404
    });
}
async function POST(req) {
    const [scope, resource, subresource] = getPathParts(req);
    if (scope === "auth" && resource === "register") {
        try {
            const { email, password, confirmPassword, name, phone, address } = await readJsonBody(req);
            if (!email || !password || !name) {
                return json({
                    message: "Email, password, dan name wajib diisi"
                }, {
                    status: 400
                });
            }
            if (password !== confirmPassword) {
                return json({
                    message: "Password tidak cocok"
                }, {
                    status: 400
                });
            }
            if (password.length < 6) {
                return json({
                    message: "Password minimal 6 karakter"
                }, {
                    status: 400
                });
            }
            const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    email
                }
            });
            if (existingUser) {
                return json({
                    message: "Email sudah terdaftar"
                }, {
                    status: 409
                });
            }
            const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 10);
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    phone: phone || null,
                    address: address || null,
                    role: "USER"
                }
            });
            const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateToken"])(user.id, user.email, user.role);
            return json({
                message: "Registrasi berhasil",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "auth" && resource === "login") {
        try {
            const { email, password } = await readJsonBody(req);
            if (!email || !password) {
                return json({
                    message: "Email dan password wajib diisi"
                }, {
                    status: 400
                });
            }
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    email
                }
            });
            if (!user) {
                return json({
                    message: "Email atau password salah"
                }, {
                    status: 401
                });
            }
            const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, user.password);
            if (!isPasswordValid) {
                return json({
                    message: "Email atau password salah"
                }, {
                    status: 401
                });
            }
            const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateToken"])(user.id, user.email, user.role);
            return json({
                message: "Login berhasil",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "admin" && resource === "products") {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        const admin = requireAdmin(auth.user);
        if (admin.error) return json({
            message: admin.error.message
        }, {
            status: admin.error.status
        });
        try {
            const data = normalizeProductInput(await readJsonBody(req));
            const validationError = validateProductInput(data);
            if (validationError) {
                return json({
                    message: validationError
                }, {
                    status: 400
                });
            }
            const existingProduct = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
                where: {
                    name: data.name
                },
                select: {
                    id: true
                }
            });
            if (existingProduct) {
                return json({
                    message: `Produk dengan nama "${data.name}" sudah ada`
                }, {
                    status: 409
                });
            }
            const product = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.create({
                data
            });
            return json(product, {
                status: 201
            });
        } catch (error) {
            if (error?.code === "P2002") {
                return json({
                    message: buildUniqueConstraintMessage(error, "Data produk sudah digunakan")
                }, {
                    status: 409
                });
            }
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "admin" && resource === "products" && subresource === "image") {
        return json({
            message: "Route tidak ditemukan"
        }, {
            status: 404
        });
    }
    if (scope === "admin" && resource && subresource === "image") {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        const admin = requireAdmin(auth.user);
        if (admin.error) return json({
            message: admin.error.message
        }, {
            status: admin.error.status
        });
        try {
            const formData = await req.formData();
            const image = formData.get("image");
            if (!image || typeof image === "string") {
                return json({
                    message: "Gambar wajib dipilih"
                }, {
                    status: 400
                });
            }
            const existingProduct = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
                where: {
                    id: resource
                },
                select: {
                    image: true,
                    imagePublicId: true
                }
            });
            if (!existingProduct) {
                return json({
                    message: "Produk tidak ditemukan"
                }, {
                    status: 404
                });
            }
            const safeName = resource.replace(/[^a-zA-Z0-9_-]/g, "-");
            const uploadResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uploadImageBuffer"])(Buffer.from(await image.arrayBuffer()), {
                folder: "surya-ban/products",
                public_id: `${safeName}-${Date.now()}`
            });
            const product = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.update({
                where: {
                    id: resource
                },
                data: {
                    image: uploadResult.secure_url,
                    imagePublicId: uploadResult.public_id
                }
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteCloudinaryImage"])(existingProduct.imagePublicId);
            return json(product);
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "orders") {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        try {
            const { cart, summary, paymentMethod } = await readJsonBody(req);
            if (!Array.isArray(cart) || cart.length === 0) {
                return json({
                    message: "Keranjang kosong"
                }, {
                    status: 400
                });
            }
            if (!supportedPayments.has(paymentMethod)) {
                return json({
                    message: "Metode pembayaran tidak didukung"
                }, {
                    status: 400
                });
            }
            const amount = Math.round(Number(summary?.grandTotal || 0));
            if (amount <= 0) {
                return json({
                    message: "Nominal transaksi tidak valid"
                }, {
                    status: 400
                });
            }
            const orderId = createOrderId();
            const status = paymentMethod === "COD" ? "COD" : "UNPAID";
            const record = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.create({
                data: {
                    orderId,
                    refCode: createRefCode(),
                    userId: auth.user.userId,
                    status,
                    paymentMethod,
                    methodLabel: buildMethodLabel(paymentMethod),
                    amount,
                    subtotal: Number(summary?.subtotal || 0),
                    serviceFee: Number(summary?.serviceFee || 0),
                    paymentFee: Number(summary?.paymentFee || 0),
                    grandTotal: amount,
                    bankInfo: paymentMethod === "TRANSFER_BANK" ? manualBankInfo : null,
                    items: {
                        create: cart.map((item)=>({
                                productId: String(item.id),
                                name: item.name,
                                size: item.size || null,
                                qty: Number(item.qty),
                                price: Number(item.price)
                            }))
                    }
                },
                include: buildOrderInclude
            });
            return json(record);
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    return json({
        message: "Route tidak ditemukan"
    }, {
        status: 404
    });
}
async function PUT(req) {
    const [scope, resource, subresource] = getPathParts(req);
    if (scope === "auth" && resource === "profile") {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        try {
            const { name, phone, address } = await readJsonBody(req);
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.update({
                where: {
                    id: auth.user.userId
                },
                data: {
                    name: name || undefined,
                    phone: phone || undefined,
                    address: address || undefined
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    address: true,
                    role: true
                }
            });
            return json({
                message: "Profil berhasil diperbarui",
                user
            });
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "auth" && resource === "change-password") {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        try {
            const { currentPassword, newPassword, confirmPassword } = await readJsonBody(req);
            if (!currentPassword || !newPassword || !confirmPassword) {
                return json({
                    message: "Semua field wajib diisi"
                }, {
                    status: 400
                });
            }
            if (newPassword !== confirmPassword) {
                return json({
                    message: "Password baru tidak cocok"
                }, {
                    status: 400
                });
            }
            if (newPassword.length < 6) {
                return json({
                    message: "Password minimal 6 karakter"
                }, {
                    status: 400
                });
            }
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    id: auth.user.userId
                }
            });
            if (!user) {
                return json({
                    message: "User tidak ditemukan"
                }, {
                    status: 404
                });
            }
            const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return json({
                    message: "Password saat ini tidak sesuai"
                }, {
                    status: 401
                });
            }
            const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(newPassword, 10);
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.update({
                where: {
                    id: auth.user.userId
                },
                data: {
                    password: hashedPassword
                }
            });
            return json({
                message: "Password berhasil diubah"
            });
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    if (scope === "admin" && resource === "products") {
        return json({
            message: "Route tidak ditemukan"
        }, {
            status: 404
        });
    }
    if (scope === "admin" && resource) {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        const admin = requireAdmin(auth.user);
        if (admin.error) return json({
            message: admin.error.message
        }, {
            status: admin.error.status
        });
        try {
            const existingProduct = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
                where: {
                    id: resource
                },
                select: {
                    image: true,
                    imagePublicId: true
                }
            });
            if (!existingProduct) {
                return json({
                    message: "Produk tidak ditemukan"
                }, {
                    status: 404
                });
            }
            const data = normalizeProductInput(await readJsonBody(req));
            const validationError = validateProductInput(data, true);
            if (validationError) {
                return json({
                    message: validationError
                }, {
                    status: 400
                });
            }
            if (Object.hasOwn(data, "image") && data.image !== existingProduct.image) {
                data.imagePublicId = null;
            }
            const product = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.update({
                where: {
                    id: resource
                },
                data
            });
            return json(product);
        } catch (error) {
            if (error?.code === "P2025") {
                return json({
                    message: "Produk tidak ditemukan"
                }, {
                    status: 404
                });
            }
            if (error?.code === "P2002") {
                return json({
                    message: buildUniqueConstraintMessage(error, "Data produk sudah digunakan")
                }, {
                    status: 409
                });
            }
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    return json({
        message: "Route tidak ditemukan"
    }, {
        status: 404
    });
}
async function PATCH(req) {
    const [scope, resource, subresource] = getPathParts(req);
    if (scope === "orders" && subresource === "status") {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        const admin = requireAdmin(auth.user);
        if (admin.error) return json({
            message: admin.error.message
        }, {
            status: admin.error.status
        });
        try {
            const { status: requestedStatus } = await readJsonBody(req);
            const nextStatus = String(requestedStatus || "").toUpperCase();
            if (!supportedStatuses.has(nextStatus)) {
                return json({
                    message: "Status tidak valid"
                }, {
                    status: 400
                });
            }
            const order = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findUnique({
                where: {
                    orderId: resource
                }
            });
            if (!order) {
                return json({
                    message: "Order tidak ditemukan"
                }, {
                    status: 404
                });
            }
            const updatedOrder = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.update({
                where: {
                    orderId: resource
                },
                data: {
                    status: nextStatus,
                    paidAt: nextStatus === "PAID" ? order.paidAt ?? new Date() : order.paidAt
                },
                include: buildOrderInclude
            });
            return json(updatedOrder);
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    return json({
        message: "Route tidak ditemukan"
    }, {
        status: 404
    });
}
async function DELETE(req) {
    const [scope, resource] = getPathParts(req);
    if (scope === "admin" && resource) {
        const auth = getAuthUser(req);
        if (auth.error) return json({
            message: auth.error.message
        }, {
            status: auth.error.status
        });
        const admin = requireAdmin(auth.user);
        if (admin.error) return json({
            message: admin.error.message
        }, {
            status: admin.error.status
        });
        try {
            const product = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
                where: {
                    id: resource
                }
            });
            if (!product) {
                return json({
                    message: "Produk tidak ditemukan"
                }, {
                    status: 404
                });
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.delete({
                where: {
                    id: resource
                }
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteCloudinaryImage"])(product.imagePublicId);
            return json({
                message: "Produk berhasil dihapus"
            });
        } catch (error) {
            return json({
                message: error.message || "Internal server error"
            }, {
                status: 500
            });
        }
    }
    return json({
        message: "Route tidak ditemukan"
    }, {
        status: 404
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0drohta._.js.map