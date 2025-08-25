

// // locationUtils.ts
// import { apiFetch } from "../utilss/apifetch";

// // ✅ Save customer's location to backend
// export const saveCustomerLocation = async (
//   lat: number,
//   lng: number
// ): Promise<boolean> => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.warn("No token found, skipping location save");
//       return false;
//     }

//     const res = await apiFetch("/api/user/location", {    
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ lat, lng }),
//     });

//     if (res.ok) {
//       const data = await res.json();
//       console.log("✅ Location saved:", data);
//       return true;
//     } else {
//       const errorData = await res.json().catch(() => ({}));
//       console.error("❌ Failed to save location:", res.status, errorData);
//       return false;
//     }
//   } catch (err) {
//     console.error("❌ Error saving location:", err);
//     return false;
//   }
// };

// // ✅ Get customer's current browser location
// export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
//   return new Promise((resolve, reject) => {
//     if (!navigator.geolocation) {
//       return reject(new Error("Geolocation not supported"));
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         resolve({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         });
//       },
//       (err) => {
//         reject(new Error("Geolocation error: " + err.message));
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 60000,
//       }
//     );
//   });
// };

// // ✅ Fetch saved location from backend
// export const getCustomerSavedLocation = async (): Promise<
//   { lat: number; lng: number } | null
// > => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) return null;

//     const res = await apiFetch("/api/user/location", {   
//       method: "GET",   
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (res.ok) {
//       const data = await res.json();
//       return data.location;
//     } else {
//       return null;
//     }
//   } catch (err) {
//     console.error("❌ Error fetching location:", err);
//     return null;
//   }
// };

// // ✅ Haversine formula to calculate distance in meters
// export const calculateDistance = (
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number
// ): number => {
//   const R = 6371000; // Earth's radius in meters
//   const toRad = (deg: number) => (deg * Math.PI) / 180;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);

//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) *
//       Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) ** 2;

//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// };






// locationUtils.ts
import { apiFetch } from "../utilss/apifetch";

// ✅ Save customer's location to backend
export const saveCustomerLocation = async (
  lat: number,
  lng: number
): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found, skipping location save");
      return false;
    }

    const res = await apiFetch("/api/user/location", {    
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat, lng }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("✅ Location saved:", data);
      return true;
    } else {
      const errorData = await res.json().catch(() => ({}));
      console.error("❌ Failed to save location:", res.status, errorData);
      return false;
    }
  } catch (err) {
    console.error("❌ Error saving location:", err);
    return false;
  }
};

// ✅ Get customer's current browser location
export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    // Check if user is logged in before requesting location
    const token = localStorage.getItem("token");
    if (!token) {
      reject(new Error("Please log in to use location services"));
      return;
    }

    if (!navigator.geolocation) {
      return reject(new Error("Geolocation not supported"));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        reject(new Error("Geolocation error: " + err.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

// ✅ Get customer's saved location from backend
export const getCustomerSavedLocation = async (): Promise<{ lat: number; lng: number } | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found, cannot fetch saved location");
      return null;
    }

    const res = await apiFetch("/api/user/location", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data.location ? {
        lat: data.location.coordinates[1],
        lng: data.location.coordinates[0],
      } : null;
    } else {
      console.error("❌ Failed to fetch saved location:", res.status);
      return null;
    }
  } catch (err) {
    console.error("❌ Error fetching saved location:", err);
    return null;
  }
};

// ✅ Haversine formula to calculate distance in meters
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

