// Unified database interface communicating with Next.js Backend API routes
import { products as initialProducts, reviews as initialReviews } from "@/data/products";

// Helper to check if running in browser
const isClient = typeof window !== "undefined";

// Fallback to localStorage/mock data if API fails or when in static/offline preview
const getStorageItem = (key, fallback) => {
  if (!isClient) return fallback;
  const item = localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorageItem = (key, data) => {
  if (isClient) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// --- AUTH HELPERS ---

/**
 * Get authorization headers if user is logged in.
 * Returns an object with the Authorization header, or empty object.
 */
export function getAuthHeaders() {
  if (!isClient) return {};
  const token = localStorage.getItem("abaya_access_token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

/**
 * Attempt to refresh the access token using the stored refresh token.
 * Returns true if refresh succeeded, false otherwise.
 */
export async function refreshAccessToken() {
  if (!isClient) return false;
  const refreshToken = localStorage.getItem("abaya_refresh_token");
  if (!refreshToken) return false;

  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const json = await res.json();
    if (json.success && json.data) {
      localStorage.setItem("abaya_access_token", json.data.accessToken);
      localStorage.setItem("abaya_refresh_token", json.data.refreshToken);
      return true;
    }
  } catch (e) {
    console.warn("Token refresh failed:", e);
  }

  return false;
}

/**
 * Make an authenticated fetch request. Automatically retries once with a
 * refreshed token if the original request returns 401.
 */
async function authFetch(url, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  let res = await fetch(url, { ...options, headers });

  // If 401, try refreshing the token and retrying once
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newHeaders = {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      };
      res = await fetch(url, { ...options, headers: newHeaders });
    }
  }

  return res;
}

// --- API FETCH WRAPPERS ---

export async function getDbProducts() {
  try {
    const res = await fetch("/api/products");
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.map(p => ({
        ...p,
        id: p.slug || p._id || p.id
      }));
    }
    return json;
  } catch (e) {
    console.warn("Products API failed, falling back to client storage:", e);
    return getStorageItem("abaya_db_products", initialProducts);
  }
}

export async function saveDbProducts(products, singleProduct = null) {
  if (singleProduct) {
    try {
      const res = await authFetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(singleProduct),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || `Server responded with status ${res.status}`);
      }
    } catch (e) {
      console.error("Failed to sync new product to server DB:", e);
      throw e;
    }
  }

  // Save locally as fallback only if we didn't throw an error
  setStorageItem("abaya_db_products", products);
}

export async function updateDbProduct(id, productData) {
  try {
    const res = await authFetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message || "Failed to update product in database");
    }
    const json = await res.json();
    return json.data;
  } catch (e) {
    console.error("Failed to update product in server DB:", e);
    throw e;
  }
}

export async function deleteDbProduct(id) {
  try {
    const res = await authFetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message || "Failed to delete product from database");
    }
  } catch (e) {
    console.error("Failed to delete product from server DB:", e);
    throw e;
  }
}

export async function getDbOrders() {
  try {
    const res = await authFetch("/api/orders");
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.map(o => ({
        ...o,
        id: o.id || o._id
      }));
    }
    return json;
  } catch (e) {
    console.warn("Orders API failed, falling back to client storage:", e);
    return getStorageItem("abaya_db_orders", []);
  }
}

export async function saveDbOrders(orders, newOrder = null) {
  setStorageItem("abaya_db_orders", orders);

  if (newOrder) {
    try {
      const res = await authFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
      const json = await res.json();
      return json;
    } catch (e) {
      console.error("Failed to sync new order to server DB:", e);
    }
  }
}

export async function updateDbOrderStatus(orderId, status) {
  try {
    await authFetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  } catch (e) {
    console.error("Failed to update order status on server DB:", e);
  }
}

export async function getDbCoupons() {
  try {
    const res = await fetch("/api/coupons");
    const json = await res.json();
    return json.success ? json.data : json;
  } catch (e) {
    console.warn("Coupons API failed, falling back to client storage:", e);
    return getStorageItem("abaya_db_coupons", []);
  }
}

export async function saveDbCoupons(coupons, newCoupon = null) {
  setStorageItem("abaya_db_coupons", coupons);

  if (newCoupon) {
    try {
      await authFetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
    } catch (e) {
      console.error("Failed to sync new coupon to server DB:", e);
    }
  }
}

export async function deleteDbCoupon(code) {
  try {
    const res = await authFetch(`/api/coupons/${code}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message || "Failed to delete coupon from database");
    }
  } catch (e) {
    console.error("Failed to delete coupon from server DB:", e);
    throw e;
  }
}

export async function getDbReviews() {
  try {
    const res = await fetch("/api/reviews");
    const json = await res.json();
    return json.success ? json.data : json;
  } catch (e) {
    console.warn("Reviews API failed, falling back to client storage:", e);
    return getStorageItem("abaya_db_reviews", initialReviews);
  }
}

export async function saveDbReviews(reviews, newReview = null) {
  setStorageItem("abaya_db_reviews", reviews);

  if (newReview) {
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
    } catch (e) {
      console.error("Failed to sync review to server DB:", e);
    }
  }
}

/**
 * Logout the current user: call the API and clear local storage.
 */
export async function logoutUser() {
  const refreshToken = isClient ? localStorage.getItem("abaya_refresh_token") : null;

  try {
    await authFetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch (e) {
    console.warn("Logout API call failed:", e);
  }

  // Always clear local storage regardless of API result
  if (isClient) {
    localStorage.removeItem("abaya_logged_user");
    localStorage.removeItem("abaya_access_token");
    localStorage.removeItem("abaya_refresh_token");
  }
}
