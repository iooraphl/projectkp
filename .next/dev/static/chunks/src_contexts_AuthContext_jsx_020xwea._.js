(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/contexts/AuthContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const readJson = async (response)=>{
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};
const getAuthErrorMessage = (error)=>{
    if (error instanceof TypeError) {
        return "Tidak bisa terhubung ke server auth. Pastikan aplikasi Next.js berjalan.";
    }
    return error.message || "Terjadi kesalahan. Silakan coba lagi.";
};
const AuthProvider = ({ children })=>{
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const API_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE_URL || "";
    // Initialize auth from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const storedToken = localStorage.getItem("authToken");
            const storedUser = localStorage.getItem("authUser");
            if (storedToken && storedUser) {
                try {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                } catch  {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("authUser");
                }
            }
            setLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    const register = async (email, password, confirmPassword, name, phone = "", address = "")=>{
        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                    confirmPassword,
                    name,
                    phone: phone || null,
                    address: address || null
                })
            });
            const data = await readJson(response);
            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("authUser", JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            return {
                success: true,
                user: data.user
            };
        } catch (err) {
            const message = getAuthErrorMessage(err);
            setError(message);
            return {
                success: false,
                error: message
            };
        }
    };
    const login = async (email, password)=>{
        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await readJson(response);
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("authUser", JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            return {
                success: true,
                user: data.user
            };
        } catch (err) {
            const message = getAuthErrorMessage(err);
            setError(message);
            return {
                success: false,
                error: message
            };
        }
    };
    const logout = ()=>{
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setToken(null);
        setUser(null);
        setError(null);
    };
    const getProfile = async ()=>{
        if (!token) return null;
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await readJson(response);
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch profile");
            }
            setUser(data);
            localStorage.setItem("authUser", JSON.stringify(data));
            return data;
        } catch (err) {
            setError(getAuthErrorMessage(err));
            return null;
        }
    };
    const updateProfile = async (name, phone, address)=>{
        if (!token) return {
            success: false,
            error: "Not authenticated"
        };
        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    phone,
                    address
                })
            });
            const data = await readJson(response);
            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            }
            setUser(data.user);
            localStorage.setItem("authUser", JSON.stringify(data.user));
            return {
                success: true,
                user: data.user
            };
        } catch (err) {
            const message = getAuthErrorMessage(err);
            setError(message);
            return {
                success: false,
                error: message
            };
        }
    };
    const changePassword = async (currentPassword, newPassword, confirmPassword)=>{
        if (!token) return {
            success: false,
            error: "Not authenticated"
        };
        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword
                })
            });
            const data = await readJson(response);
            if (!response.ok) {
                throw new Error(data.message || "Failed to change password");
            }
            return {
                success: true,
                message: data.message
            };
        } catch (err) {
            const message = getAuthErrorMessage(err);
            setError(message);
            return {
                success: false,
                error: message
            };
        }
    };
    const isAuthenticated = !!token && !!user;
    const isAdmin = user?.role === "ADMIN";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            token,
            loading,
            error,
            isAuthenticated,
            isAdmin,
            register,
            login,
            logout,
            getProfile,
            updateProfile,
            changePassword,
            setError
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.jsx",
        lineNumber: 212,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "ihfjI6MF9YjLOpbFlkCQPaRWc98=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_contexts_AuthContext_jsx_020xwea._.js.map