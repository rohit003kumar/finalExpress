// "use client"

// import { useState, useRef } from "react"
// import { useNavigate } from "react-router-dom"
// import "./AdminDashboard.css"
// import { useEffect } from "react"
// import axios from "../utilss/axios" // Adjust the import path as necessary  
// import { Menu, X } from "lucide-react"

// const AdminDashboard = () => {
//   const navigate = useNavigate()
//   const fileInputRef = useRef(null)

//   // Add mobile menu state
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

//   const [adminProfile, setAdminProfile] = useState({
//     name: "Admin User",
//     email: "admin@laundryservice.com",
//     role: "Super Admin",
//     phone: "+1-234-567-8900",
//     address: "123 Admin Street, Business District",
//     joinDate: "2024-01-01",
//     image: "https://randomuser.me/api/portraits/men/1.jpg",
//   })

//   const [activePage, setActivePage] = useState("Dashboard")
//   const [showLogoutPopup, setShowLogoutPopup] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [showUserModal, setShowUserModal] = useState(false)
//   const [showOrderModal, setShowOrderModal] = useState(false)
//   const [selectedOrder, setSelectedOrder] = useState(null)
//   const [isEditingProfile, setIsEditingProfile] = useState(false)
//   const [previewImage, setPreviewImage] = useState(null)
//   const [orderFilter, setOrderFilter] = useState("All Orders")
//   const [dateFilter, setDateFilter] = useState("")
//   const [analyticsFilter, setAnalyticsFilter] = useState("Last 7 Days")
//   const [showAddCustomerModal, setShowAddCustomerModal] = useState(false)
//   const [showAddLaundrymanModal, setShowAddLaundrymanModal] = useState(false)
//   const [showAssignOrderModal, setShowAssignOrderModal] = useState(false)
//   const [showTimeSlotModal, setShowTimeSlotModal] = useState(false)
//   const [showEditTimeSlotModal, setShowEditTimeSlotModal] = useState(false)
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
//   const [showUserDashboardModal, setShowUserDashboardModal] = useState(false)
//   const [selectedUserDashboard, setSelectedUserDashboard] = useState(null)
//   const [customerSearchTerm, setCustomerSearchTerm] = useState("")
//   const [laundrymanSearchTerm, setLaundrymanSearchTerm] = useState("")
//   const [timeSlots, setTimeSlots] = useState([]);

//   const [newSlot, setNewSlot] = useState({ slot: "", maxOrders: 20 });


//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [showModal, setShowModal] = useState(false);



//   // State for customers and laundrymen
//   const [profile, setProfile] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [laundrymen, setLaundrymen] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);



//   // ✅ Place this at the top of your file, before the component definition
//   // Helper function to format enabled slots into readable working hours
//   function getWorkingHoursFromSlots(slots) {
//     if (!Array.isArray(slots) || slots.length === 0) return "N/A";

//     const ranges = slots
//       .filter(s => s.isEnabled)
//       .map(s => s.label || `${s.start} - ${s.end}`); // fallback if label missing

//     return ranges.join(", ");
//   }



//   // Mobile menu toggle function
//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen)
//   }

//   // Close mobile menu when clicking on navigation items
//   const handleNavClick = (page) => {
//     setActivePage(page)
//     setIsMobileMenuOpen(false) // Close mobile menu
//   }

//   // Close mobile menu when clicking overlay
//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false)
//   }

//   // useEffect(() => {
//   //   const token = localStorage.getItem("token");
//   //   console.log(1)
//   //   console.log(token);

//   //   const fetchCustomers = async () => {
//   //     try {
//   //       console.log("Fetching customers from backend...");
//   //       const res = await axios.get("http://localhost:5000/api/user/", {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`
//   //         }
//   //       });
//   //       setCustomers(res.data || []);
//   //     } catch (error) {
//   //       console.error("Error fetching customers:", error);
//   //     }
//   //   };

//   //   const fetchProfile = async () => {
//   //     try {
//   //       const res = await axios.get("http://localhost:5000/api/user/currentuser", {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`
//   //         }
//   //       });
//   //       setProfile({
//   //         name: res.data.name,
//   //         email: res.data.email,
//   //         contact: res.data.contact,
//   //         image: "/src/washer.png",
//   //         _id: res.data._id,
//   //       });
//   //     } catch (err) {
//   //       console.error("Failed to fetch profile:", err);
//   //     }
//   //   };

//   //   const fetchLaundrymen = async () => {
//   //     try {
//   //       console.log("Fetching laundrymen from backend...");
//   //       const res = await axios.get("http://localhost:5000/api/washerman", {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`
//   //         }
//   //       });
//   //       const transformedLaundrymen = (res.data || []).map((l) => ({
//   //         id: l.id || l._id || "",
//   //         name: l.name || "",
//   //         email: l.email || "",
//   //         phone: l.phone || "",
//   //         address: l.address || "",
//   //         image: l.image || "",
//   //         specialties: Array.isArray(l.specialties) ? l.specialties : [],
//   //         workingHours: Array.isArray(l.workingHours) ? l.workingHours : [],
//   //         maxOrders: typeof l.maxOrders === "number" ? l.maxOrders : 0,
//   //         completedOrders: typeof l.completedOrders === "number" ? l.completedOrders : 0,
//   //         rating: typeof l.rating === "number" ? l.rating : 0,
//   //         status: l.status || "Active",
//   //         earnings: typeof l.earnings === "number" ? l.earnings : 0,
//   //         availability: l.availability || "Available",
//   //         currentOrders: typeof l.currentOrders === "number" ? l.currentOrders : 0,
//   //         joinDate: l.joinDate || "",
//   //       }));
//   //       setLaundrymen(transformedLaundrymen);
//   //     } catch (error) {
//   //       console.error("Error fetching laundrymen:", error);
//   //     }
//   //   };

//   //   const fetchAll = async () => {
//   //     setLoading(true);
//   //     await Promise.all([fetchCustomers(), fetchLaundrymen()]);
//   //     setLoading(false);
//   //   };

//   //   let profile = {};
//   //   async () => {
//   //     profile = await fetchProfile();
//   //   }
//   //   console.log(profile)

//   //   fetchAll();
//   // }, []);



//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     console.log("Token:", token);

//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("/api/user/currentuser", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const user = res.data;
//         setProfile({
//           name: user.name,
//           email: user.email,
//           contact: user.contact,
//           image: "/src/washer.png",
//           _id: user._id,
//         });
//         console.log("Profile fetched:", user);
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//       }
//     };

//     const fetchCustomers = async () => {
//       try {
//         console.log("Fetching customers...");
//         const res = await axios.get("/api/user/", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setCustomers(res.data || []);
//       } catch (error) {
//         console.error("Error fetching customers:", error);
//       }
//     };

//     const fetchLaundrymen = async () => {
//       try {
//         console.log("Fetching laundrymen...");
//         const res = await axios.get("/api/washerman/dashboard/all", {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         const transformed = (res.data || []).map((l) => ({
//           id: l.id || l._id || "",
//           name: l.name || "",
//           email: l.email || "",
//           address: l.address || "",
//           image: l.image || "/src/washer.png",
//           specialties: Array.isArray(l.specialties) ? l.specialties : [],
//           workingHours: Array.isArray(l.workingHours) ? l.workingHours : [],
//           maxOrders: l.maxOrders ?? 0,
//           totalOrders: l.totalOrders ?? 0,
//           completedOrders: l.completedOrders ?? 0,
//           rating: l.rating ?? 0,
//           status: l.status || "Active",
//           earnings: l.earnings ?? 0,
//           availability: l.availability || "Available",
//           contact: l.contact || "",                      // ✅ correct field
//           createdAt: l.createdAt || "",
//         }));

//         setLaundrymen(transformed);
//       } catch (error) {
//         console.error("Error fetching laundrymen:", error);
//       }
//     };


//     const fetchAll = async () => {
//       setLoading(true);
//       await Promise.all([fetchProfile(), fetchCustomers(), fetchLaundrymen()]);
//       setLoading(false);
//     };

//     fetchAll();
//   }, []);



//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     console.log(2);

//     const fetchAllBookings = async () => {
//       try {
//         const res = await axios.get("/api/booking/all", {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         console.log("Bookings from backend:", res.data);

//         const bookings = (res.data || []).map((b) => ({
//           id: b._id || b.id,
//           customerId: b.guest?._id || "",
//           customerName: b.guest?.name || "Unassigned",
//           laundrymanId: b.washerman?._id || "",
//           laundrymanName: b.washerman?.name || "Unassigned",
//           items: b.productId?.category
//             ? [`${b.quantity} x ${b.productId.category}`]
//             : ["Item"],
//           totalAmount: b.totalAmount || 0,
//           status: b.status || "Pending",
//           pickupDate: b.date?.slice(0, 10) || "",   // ✅ using 'date' field for pickupDate
//           timeSlot: b.slot?.range || "Not specified", // ✅ using slot.range
//           timeSlotLabel: b.slot?.label || "",         // optional
//           priority: b.priority || "Normal",
//           orderDate: b.createdAt
//             ? b.createdAt.slice(0, 10)
//             : b.orderDate
//               ? b.orderDate.slice(0, 10)
//               : "",
//           paymentMethod: b.paymentMethod || "Cash",
//           paymentStatus: b.paymentStatus || "Pending"
//         }));

//         setOrders(bookings);
//       } catch (err) {
//         console.error("Error fetching bookings:", err);
//       }
//     };

//     fetchAllBookings();
//   }, []);

//   // Time slots management
//   const fetchTimeSlots = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("/api/slot-templates", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const transformed = (res.data || []).map((slot) => ({
//         id: slot._id,
//         slot: slot.time || "Unnamed Slot",
//         currentOrders: 0,
//         maxOrders: 0,
//         active: false,
//       }));
//       setTimeSlots(transformed);
//     } catch (err) {
//       console.error("Failed to fetch time slots", err);
//     }
//   };

//   useEffect(() => {
//     console.log(3);
//     fetchTimeSlots();
//   }, []);

//   const handleAddTimeSlot = async (newSlot) => {
//     try {
//       const payload = {
//         time: newSlot.slot,
//         period: newSlot.slot
//       };
//       await axios.post("/api/slot", payload);
//       await fetchTimeSlots();
//     } catch (err) {
//       console.error("Add failed", err);
//     }
//   };

//   // Settings state
//   const [settings, setSettings] = useState({
//     commission: 15,
//     minOrderAmount: 100,
//     maxServiceRadius: 25,
//     emailNotifications: true,
//     smsNotifications: true,
//     pushNotifications: false,
//     sessionTimeout: 30,
//   })

//   const [serviceAreas, setServiceAreas] = useState(["Downtown Mumbai", "Andheri", "Bandra"])
//   const [newArea, setNewArea] = useState("")

//   // Dashboard statistics
//   const dashboardStats = {
//     totalCustomers: customers.length,
//     activeCustomers: customers.filter((c) => c.status === "Active").length,
//     totalLaundrymen: laundrymen.length,
//     activeLaundrymen: laundrymen.filter((l) => l.status === "Active").length,
//     totalOrders: orders.length,
//     pendingOrders: orders.filter((o) => o.status === "Pending").length,
//     completedOrders: orders.filter((o) => o.status === "Delivered").length,
//     unassignedOrders: orders.filter((o) => !o.laundrymanId).length,
//     totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
//     todayRevenue: 2400,
//     monthlyRevenue: 45000,
//   }

//   // Filter functions
//   const filteredCustomers = customers.filter(
//     (customer) =>
//       customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
//       customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()),
//   )

//   const filteredLaundrymen = laundrymen.filter(
//     (laundryman) =>
//       laundryman.name.toLowerCase().includes(laundrymanSearchTerm.toLowerCase()) ||
//       laundryman.email.toLowerCase().includes(laundrymanSearchTerm.toLowerCase()),
//   )

//   const filteredOrders = orders.filter((order) => {
//     const matchesStatus = orderFilter === "All Orders" || order.status === orderFilter
//     const matchesDate = !dateFilter || order.orderDate === dateFilter
//     return matchesStatus && matchesDate
//   })

//   const handleUserAction = (userId, action, userType) => {
//     if (userType === "customer") {
//       setCustomers(
//         customers.map((customer) =>
//           customer.id === userId ? { ...customer, status: action === "activate" ? "Active" : "Inactive" } : customer,
//         ),
//       )
//     } else {
//       setLaundrymen(
//         laundrymen.map((laundryman) =>
//           laundryman.id === userId
//             ? { ...laundryman, status: action === "activate" ? "Active" : "Inactive" }
//             : laundryman,
//         ),
//       )
//     }
//   }

//   const handleViewUser = (user, userType) => {
//     setSelectedUser({ ...user, userType })
//     setShowUserModal(true)
//   }

//   const handleViewUserDashboard = (user, userType) => {
//     setSelectedUserDashboard({ ...user, userType })
//     setShowUserDashboardModal(true)
//   }

//   const handleViewOrder = (order) => {
//     setSelectedOrder(order)
//     setShowOrderModal(true)
//   }

//   const handleOrderStatusUpdate = (orderId, newStatus) => {
//     setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
//     setShowOrderModal(false)
//   }

//   const handleAssignOrder = (orderId, laundrymanId) => {
//     const laundryman = laundrymen.find((l) => l.id === laundrymanId)
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId ? { ...order, laundrymanId, laundrymanName: laundryman.name, status: "Assigned" } : order,
//       ),
//     )
//     setShowAssignOrderModal(false)
//   }

//   const handleAddCustomer = (customerData) => {
//     const newCustomer = {
//       id: `CUST${String(customers.length + 1).padStart(3, "0")}`,
//       ...customerData,
//       joinDate: new Date().toISOString().split("T")[0],
//       totalOrders: 0,
//       totalSpent: 0,
//       status: "Active",
//       lastOrder: null,
//       loyaltyPoints: 0,
//     }
//     setCustomers([...customers, newCustomer])
//     setShowAddCustomerModal(false)
//   }

//   const handleAddLaundryman = (laundrymanData) => {
//     const newLaundryman = {
//       id: `LAUN${String(laundrymen.length + 1).padStart(3, "0")}`,
//       ...laundrymanData,
//       joinDate: new Date().toISOString().split("T")[0],
//       completedOrders: 0,
//       rating: 0,
//       status: "Active",
//       earnings: 0,
//       availability: "Available",
//       currentOrders: 0,
//     }
//     setLaundrymen([...laundrymen, newLaundryman])
//     setShowAddLaundrymanModal(false)
//   }

//   const handleEditTimeSlot = (slot) => {
//     setSelectedTimeSlot(slot)
//     setShowEditTimeSlotModal(true)
//   }

//   const handleSaveTimeSlotEdit = (e) => {
//     e.preventDefault()
//     const formData = new FormData(e.target)
//     const updatedSlot = {
//       ...selectedTimeSlot,
//       slot: formData.get("slot"),
//       maxOrders: parseInt(formData.get("maxOrders")),
//     }

//     setTimeSlots(timeSlots.map((slot) =>
//       slot.id === selectedTimeSlot.id ? updatedSlot : slot
//     ))

//     setShowEditTimeSlotModal(false)
//     setSelectedTimeSlot(null)
//   }

//   const handleProfileEdit = () => {
//     setIsEditingProfile(true)
//     setActivePage("Profile")
//     setPreviewImage(adminProfile.image)
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setPreviewImage(reader.result)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleSaveProfile = (e) => {
//     e.preventDefault()
//     const formData = new FormData(e.target)
//     const imageFile = e.target.image.files[0]

//     if (imageFile) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setAdminProfile({
//           ...adminProfile,
//           name: formData.get("name"),
//           email: formData.get("email"),
//           phone: formData.get("phone"),
//           address: formData.get("address"),
//           image: reader.result,
//         })
//         setIsEditingProfile(false)
//         setActivePage("Dashboard")
//       }
//       reader.readAsDataURL(imageFile)
//     } else {
//       setAdminProfile({
//         ...adminProfile,
//         name: formData.get("name"),
//         email: formData.get("email"),
//         phone: formData.get("phone"),
//         address: formData.get("address"),
//         image: previewImage || adminProfile.image,
//       })
//       setIsEditingProfile(false)
//       setActivePage("Dashboard")
//     }
//   }

//   const handleSettingChange = (setting, value) => {
//     setSettings({ ...settings, [setting]: value })
//   }

//   const handleToggleSetting = (setting) => {
//     setSettings({ ...settings, [setting]: !settings[setting] })
//   }

//   const handleAddServiceArea = () => {
//     if (newArea.trim() && !serviceAreas.includes(newArea.trim())) {
//       setServiceAreas([...serviceAreas, newArea.trim()])
//       setNewArea("")
//     }
//   }

//   const handleRemoveServiceArea = (index) => {
//     setServiceAreas(serviceAreas.filter((_, i) => i !== index))
//   }

//   const handleCreateBackup = () => {
//     alert("Backup created successfully!")
//   }

//   const handleEnable2FA = () => {
//     alert("Two-Factor Authentication setup would be implemented here")
//   }

//   const handleLogout = () => {
//     setShowLogoutPopup(true)
//   }

//   const confirmLogout = () => {
//     setShowLogoutPopup(false)
//     navigate("/SignIn")
//   }

//   const cancelLogout = () => {
//     setShowLogoutPopup(false)
//   }

//   const getGreeting = () => {
//     const hour = new Date().getHours()
//     if (hour < 12) return "Good Morning"
//     if (hour < 17) return "Good Afternoon"
//     return "Good Evening"
//   }

//   return (
//     <div className="admin-dashboard-container">
//       {/* Mobile Header */}
//       <header className="mobile-header">
//         <div className="mobile-header-content">
//           <div className="mobile-logo">
//             <span className="logo-icon">🧺</span>
//             <span className="logo-text">LaundryAdmin</span>
//           </div>
//           <button
//             className="mobile-menu-toggle"
//             onClick={toggleMobileMenu}
//             aria-label="Toggle menu"
//           >
//             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </header>

//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
//       )}

//       {/* Sidebar */}
//       <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
//         <div className="admin-sidebar-header desktop-only">
//           <div className="admin-logo">
//             <span className="logo-icon">🧺</span>
//             <span className="logo-text">LaundryAdmin</span>
//           </div>
//         </div>
//         <div className="admin-sidebar-profile" onClick={handleProfileEdit}>
//           <img src={adminProfile.image || "/placeholder.svg"} alt="Admin" className="admin-profile-img" />
//           <div className="admin-profile-info">
//             <span className="admin-profile-name">{adminProfile.name}</span>
//             <span className="admin-profile-role">{adminProfile.role}</span>
//           </div>
//         </div>
//         <nav className="admin-nav">
//           <button className={activePage === "Dashboard" ? "active" : ""} onClick={() => handleNavClick("Dashboard")}>
//             <span className="nav-icon">📊</span>
//             <span className="nav-text">Dashboard</span>
//           </button>
//           <button className={activePage === "Customers" ? "active" : ""} onClick={() => handleNavClick("Customers")}>
//             <span className="nav-icon">👥</span>
//             <span className="nav-text">Customers</span>
//           </button>
//           <button className={activePage === "Laundrymen" ? "active" : ""} onClick={() => handleNavClick("Laundrymen")}>
//             <span className="nav-icon">👨‍💼</span>
//             <span className="nav-text">Dhobi</span>
//           </button>
//           <button className={activePage === "Orders" ? "active" : ""} onClick={() => handleNavClick("Orders")}>
//             <span className="nav-icon">📦</span>
//             <span className="nav-text">Orders</span>
//           </button>
//           <button
//             className={activePage === "TimeSlots" ? "active" : ""}
//             onClick={() => {
//               navigate("/SlotTemplateManagers");
//               setActivePage("TimeSlots");
//               setIsMobileMenuOpen(false);
//             }}
//           >
//             <span className="nav-icon">⏰</span>
//             <span className="nav-text">Time Slots</span>
//           </button>
//           <button
//             className={activePage === "Messages" ? "active" : ""}
//             onClick={() => {
//               navigate("/AdminMessages");
//               setActivePage("Messages");
//               setIsMobileMenuOpen(false);
//             }}
//           >
//             Contact Messages
//           </button>
//           <button className="admin-logout-btn" onClick={handleLogout}>
//             <span className="nav-icon">🚪</span>
//             <span className="nav-text">Logout</span>
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="admin-main-content">
//         {activePage === "Dashboard" && (
//           <div className="admin-dashboard-page">
//             {/* Welcome Section */}
//             <section className="admin-welcome-section">
//               <div className="welcome-content">
//                 <h1>
//                   {getGreeting()}, {adminProfile.name}! 👋
//                 </h1>
//                 <p>Here's an overview of your laundry service platform</p>
//               </div>
//               <div className="admin-date-time">
//                 <div className="current-date">
//                   {new Date().toLocaleDateString("en-US", {
//                     weekday: "long",
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </div>
//                 <div className="current-time">
//                   {new Date().toLocaleTimeString("en-US", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </div>
//               </div>
//             </section>

//             {/* Dashboard Statistics */}
//             <section className="admin-stats-section">
//               <div className="admin-stats-grid">
//                 <div className="admin-stat-card customers">
//                   <div className="stat-icon">👥</div>
//                   <div className="stat-content">
//                     <h3>Total Customers</h3>
//                     <p className="stat-number">{dashboardStats.totalCustomers}</p>
//                     <span className="stat-label">{dashboardStats.activeCustomers} Active</span>
//                   </div>
//                 </div>
//                 <div className="admin-stat-card laundrymen">
//                   <div className="stat-icon">👨‍💼</div>
//                   <div className="stat-content">
//                     <h3>Dhobi</h3>
//                     <p className="stat-number">{dashboardStats.totalLaundrymen}</p>
//                     <span className="stat-label">{dashboardStats.activeLaundrymen} Active</span>
//                   </div>
//                 </div>
//                 <div className="admin-stat-card orders">
//                   <div className="stat-icon">📦</div>
//                   <div className="stat-content">
//                     <h3>Total Orders</h3>
//                     <p className="stat-number">{dashboardStats.totalOrders}</p>
//                     <span className="stat-label">{dashboardStats.pendingOrders} Pending</span>
//                   </div>
//                 </div>
//                 <div className="admin-stat-card unassigned">
//                   <div className="stat-icon">⚠️</div>
//                   <div className="stat-content">
//                     <h3>Unassigned Orders</h3>
//                     <p className="stat-number">{dashboardStats.unassignedOrders}</p>
//                     <span className="stat-label">Need Assignment</span>
//                   </div>
//                 </div>
//                 <div className="admin-stat-card revenue">
//                   <div className="stat-icon">₹</div>
//                   <div className="stat-content">
//                     <h3>Total order amount</h3>
//                     <p className="stat-number">₹{dashboardStats.totalRevenue.toLocaleString()}</p>
//                     <span className="stat-label">This Month</span>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Quick Actions */}
//             <section className="admin-quick-actions">
//               <h3>Quick Actions</h3>
//               <div className="quick-actions-grid">
//                 <button className="quick-action-btn" onClick={() => handleNavClick("Customers")}>
//                   <div className="action-icon">👥</div>
//                   <span>Manage Customers</span>
//                 </button>
//                 <button className="quick-action-btn" onClick={() => handleNavClick("Laundrymen")}>
//                   <div className="action-icon">👨‍💼</div>
//                   <span>Manage Dhobi</span>
//                 </button>
//                 <button className="quick-action-btn" onClick={() => handleNavClick("Orders")}>
//                   <div className="action-icon">📦</div>
//                   <span>View Orders</span>
//                 </button>
//                 <button className="quick-action-btn" onClick={() => handleNavClick("TimeSlots")}>
//                   <div className="action-icon">⏰</div>
//                   <span>Manage Time Slots</span>
//                 </button>
// {/*                 <button className="quick-action-btn" onClick={() => handleNavClick("Analytics")}>
//                   <div className="action-icon">📈</div>
//                   <span>View Analytics</span>
//                 </button> */}
//               </div>
//             </section>


//           </div>
//         )}

//         {activePage === "Profile" && (
//           <div className="admin-profile-page">
//             <div className="page-header">
//               <h2>Admin Profile</h2>
//               <button className="back-btn" onClick={() => handleNavClick("Dashboard")}>
//                 ← Back to Dashboard
//               </button>
//             </div>

//             {isEditingProfile ? (
//               <div className="edit-profile-section">
//                 <h3>Edit Profile</h3>
//                 <img
//                   src={previewImage || adminProfile.image || "/placeholder.svg"}
//                   alt="Profile Preview"
//                   className="profile-image-preview"
//                 />
//                 <form onSubmit={handleSaveProfile} className="edit-form">
//                   <div className="form-group">
//                     <label htmlFor="name">Full Name</label>
//                     <input
//                       id="name"
//                       name="name"
//                       type="text"
//                       defaultValue={adminProfile.name}
//                       required
//                       placeholder="Enter your full name"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="email">Email Address</label>
//                     <input
//                       id="email"
//                       name="email"
//                       type="email"
//                       defaultValue={adminProfile.email}
//                       required
//                       placeholder="Enter your email address"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="phone">Phone Number</label>
//                     <input
//                       id="phone"
//                       name="phone"
//                       type="tel"
//                       defaultValue={adminProfile.phone}
//                       required
//                       placeholder="Enter your phone number"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="address">Address</label>
//                     <textarea
//                       id="address"
//                       name="address"
//                       defaultValue={adminProfile.address}
//                       required
//                       placeholder="Enter your address"
//                       rows="3"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="image">Profile Image</label>
//                     <input
//                       id="image"
//                       name="image"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       ref={fileInputRef}
//                     />
//                   </div>
//                   <div className="profile-buttons">
//                     <button type="submit" className="save-btn">
//                       Save Changes
//                     </button>
//                     <button
//                       type="button"
//                       className="cancel-btn"
//                       onClick={() => {
//                         setIsEditingProfile(false)
//                         setActivePage("Dashboard")
//                       }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             ) : (
//               <div className="profile-view-section">
//                 <div className="profile-card">
//                   <div className="profile-image-section">
//                     <img src={adminProfile.image || "/placeholder.svg"} alt="Admin Profile" className="profile-image" />
//                     <button className="change-photo-btn" onClick={() => setIsEditingProfile(true)}>
//                       Edit Profile
//                     </button>
//                   </div>
//                   <div className="profile-info">
//                     <div className="info-group">
//                       <label>Full Name</label>
//                       <p>{adminProfile.name}</p>
//                     </div>
//                     <div className="info-group">
//                       <label>Email Address</label>
//                       <p>{adminProfile.email}</p>
//                     </div>
//                     <div className="info-group">
//                       <label>Phone Number</label>
//                       <p>{adminProfile.phone}</p>
//                     </div>
//                     <div className="info-group">
//                       <label>Role</label>
//                       <p>{adminProfile.role}</p>
//                     </div>
//                     <div className="info-group">
//                       <label>Address</label>
//                       <p>{adminProfile.address}</p>
//                     </div>
//                     <div className="info-group">
//                       <label>Join Date</label>
//                       <p>{adminProfile.joinDate}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {activePage === "Customers" && (
//           <div className="admin-customers-page">
//             <div className="page-header">
//               <h2>Customer Management</h2>
//               <div className="header-actions">
//                 <input
//                   type="text"
//                   placeholder="Search customers..."
//                   value={customerSearchTerm}
//                   onChange={(e) => setCustomerSearchTerm(e.target.value)}
//                   className="search-input"
//                 />
//               </div>
//             </div>

//             <div className="customers-grid">
//               {filteredCustomers.map((customer) => (
//                 <div key={customer._id} className="customer-card">
//                   {/* Header: Avatar + Info */}
//                   <div className="customer-header">
//                     <img
//                       src="/profile.webp" // ✅ Fixed image from public folder
//                       alt="User avatar"
//                       className="customer-image w-16 h-16 rounded-full object-cover"
//                     />
//                     <div className="customer-info">
//                       <h4>{customer.name}</h4>
//                       <p>{customer.email}</p>
//                     </div>
//                   </div>

//                   {/* Stats: Orders + Spent */}
//                   <div className="customer-stats bg-gray-100 p-3 rounded-xl mt-2">
//                     <div className="stat">
//                       <span className="stat-label text-sm text-gray-500">Orders</span>
//                       <span className="stat-value font-semibold">{customer.totalOrders || 0}</span>
//                     </div>
//                     {/* <div className="stat">
//                       <span className="stat-label text-sm text-gray-500">pending</span>
//                       <span className="stat-value font-semibold">{customer.pendingOrders || 0}</span>
//                     </div> */}
//                     <div className="stat">
//                       <span className="stat-label text-sm text-gray-500">Spent</span>
//                       <span className="stat-value font-semibold">₹{customer.totalSpent || 0}</span>
//                     </div>
//                   </div>

//                   <button
//                     className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     onClick={() => {
//                       setSelectedCustomer(customer);
//                       setShowModal(true);
//                     }}
//                   >
//                     View
//                   </button>


//                   {/* Optional: Preferences */}
//                   {/* {customer.preferences?.length > 0 && (
//                     <div className="customer-preferences mt-2">
//                       <h5 className="text-sm font-medium mb-1">Preferences:</h5>
//                       <div className="preferences-tags flex flex-wrap gap-1">
//                         {customer.preferences.map((pref, index) => (
//                           <span
//                             key={index}
//                             className="preference-tag bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
//                           >
//                             {pref}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )} */}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}



//         {showModal && selectedCustomer && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
//               >
//                 ✕
//               </button>

//               <h2 className="text-xl font-semibold mb-4">Customer Details</h2>

//               <div className="space-y-2 text-sm">
//                 <p><strong>Name:</strong> {selectedCustomer.name}</p>
//                 <p><strong>Email:</strong> {selectedCustomer.email}</p>
//                 <p><strong>Contact:</strong> {selectedCustomer.contact || "Not Provided"}</p>

//                 {/* Address breakdown */}
//                 <p>
//                   <strong>Address:</strong>{" "}
//                   {selectedCustomer.address?.street || selectedCustomer.address?.city || selectedCustomer.address?.state
//                     ? `${selectedCustomer.address?.street || ""}, ${selectedCustomer.address?.city || ""}, ${selectedCustomer.address?.state || ""}, ${selectedCustomer.address?.zip || ""}`
//                     : "Not Provided"}
//                 </p>

//                 <p>
//                   <strong>Joined On:</strong>{" "}
//                   {selectedCustomer.createdAt
//                     ? new Date(selectedCustomer.createdAt).toLocaleDateString()
//                     : "Not Available"}
//                 </p>

//                 <p><strong>Orders:</strong> {selectedCustomer.totalOrders || 0}</p>
//                 <p><strong>Spent:</strong> ₹{selectedCustomer.totalSpent || 0}</p>
//               </div>
//             </div>
//           </div>
//         )}





//         {activePage === "Laundrymen" && (
//           <div className="admin-laundrymen-page">
//             <div className="page-header">
//               <h2>Dhobi Management</h2>
//               <div className="header-actions">
//                 <input
//                   type="text"
//                   placeholder="Search Dhobi..."
//                   value={laundrymanSearchTerm}
//                   onChange={(e) => setLaundrymanSearchTerm(e.target.value)}
//                   className="search-input"
//                 />
//                 {/* <button className="add-btn" onClick={() => setShowAddLaundrymanModal(true)}>
//           + Add Laundryman
//         </button> */}
//               </div>
//             </div>

//             <div className="laundrymen-grid">
//               {filteredLaundrymen.map((laundryman) => (
//                 <div key={laundryman.id} className="laundryman-card">
//                   <div className="laundryman-header">
//                     <img
//                       src="/washer.webp"
//                       alt="Dhobi avatar"
//                       className="customer-image w-16 h-16 rounded-full object-cover"
//                     />
//                     <div className="laundryman-info">
//                       <h4>{laundryman.name}</h4>
//                       <p>{laundryman.email}</p>
//                       <div className="rating"></div>
//                       <span className={`status-badge ${laundryman.status.toLowerCase()}`}>
//                         {laundryman.status}
//                       </span>
//                       <span className={`availability-badge ${laundryman.availability.toLowerCase()}`}>
//                         {laundryman.availability}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="laundryman-stats">
//                     <div className="stat">
//                       <span className="stat-label">Total Orders</span>
//                       <span className="stat-value">{laundryman.totalOrders}</span>
//                     </div>
//                     <div className="stat">
//                       <span className="stat-label">Completed</span>
//                       <span className="stat-value">{laundryman.completedOrders}</span>
//                     </div>
//                     <div className="stat">
//                       <span className="stat-label">Earnings</span>
//                       <span className="stat-value">₹{laundryman.earnings}</span>
//                     </div>
//                   </div>

// {/*                   <div className="specialties">
//                     {laundryman.specialties.map((specialty, index) => (
//                       <span key={index} className="specialty-tag">
//                         {specialty}
//                       </span>
//                     ))}
//                   </div> */}

// {/*                   <div className="working-hours">
//                     <h5>Working Hours:</h5>
//                     <div className="hours-list">
//                       {laundryman.workingHours.map((hour, index) => (
//                         <span key={index} className="hour-tag">
//                           {hour}
//                         </span>
//                       ))}
//                     </div> 
//                   </div>*/}



//                   <div className="laundryman-actions">
//                     <button
//                       className="dashboard-btn"
//                       onClick={() => handleViewUserDashboard(laundryman, "laundryman")}
//                     >
//                       Dashboard
//                     </button>

//                     <button
//                       className={laundryman.status === "Active" ? "deactivate-btn" : "activate-btn"}
//                       onClick={() =>
//                         handleUserAction(
//                           laundryman.id,
//                           laundryman.status === "Active" ? "deactivate" : "activate",
//                           "laundryman"
//                         )
//                       }
//                     >
//                       {laundryman.status === "Active" ? "Deactivate" : "Activate"}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {activePage === "Orders" && (
//           <div className="admin-orders-page">
//             <div className="page-header">
//               <h2>Order Management</h2>
//               <div className="order-filters">
//                 <select className="filter-select" value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)}>
//                   <option>All Orders</option>
//                   <option>Pending</option>
//                   <option>Assigned</option>
//                   <option>In Progress</option>
//                   <option>Delivered</option>
//                 </select>
//                 <input
//                   type="date"
//                   className="date-filter"
//                   value={dateFilter}
//                   onChange={(e) => setDateFilter(e.target.value)}
//                 />
//                 <button
//                   className="clear-filter-btn"
//                   onClick={() => {
//                     setOrderFilter("All Orders")
//                     setDateFilter("")
//                   }}
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             </div>

//             <div className="orders-table-container">
//               <table className="orders-table">
//                 <thead>
//                   <tr>
//                     <th>Order ID</th>
//                     <th>Customer</th>
//                     <th>Dhobi</th>
//                     <th>Items</th>
//                     <th>Amount</th>
//                     <th>Status</th>
//                     <th>Time Slot</th>
//                     <th>Priority</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredOrders.map((order) => (
//                     <tr key={order.id}>
//                       <td>{order.id}</td>
//                       <td>{order.customerName}</td>
//                       <td>
//                         {order.laundrymanName}
//                         {!order.laundrymanId && (
//                           <button
//                             className="assign-btn small"
//                             onClick={() => {
//                               setSelectedOrder(order)
//                               setShowAssignOrderModal(true)
//                             }}
//                           >
//                             Assign
//                           </button>
//                         )}
//                       </td>
//                       <td>{order.items.join(", ")}</td>
//                       <td>₹{order.totalAmount}</td>
//                       <td>
//                         <span className={`status-badge ${order.status.toLowerCase().replace(" ", "-")}`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td>{order.timeSlot}</td>
//                       <td>
//                         <span className={`priority-badge ${order.priority.toLowerCase()}`}>{order.priority}</span>
//                       </td>
//                       <td>
//                         <button className="view-btn small" onClick={() => handleViewOrder(order)}>
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {activePage === "TimeSlots" && (
//           <SlotTemplateManager />
//         )}

//         {activePage === "Analytics" && (
//           <div className="admin-analytics-page">
//             <div className="page-header">
//               <h2>Analytics & Reports</h2>
//               <div className="analytics-filters">
//                 <select
//                   className="filter-select"
//                   value={analyticsFilter}
//                   onChange={(e) => setAnalyticsFilter(e.target.value)}
//                 >
//                   <option>Last 7 Days</option>
//                   <option>Last 30 Days</option>
//                   <option>Last 3 Months</option>
//                   <option>Last Year</option>
//                 </select>
//                 <button className="export-btn">Export Report</button>
//               </div>
//             </div>
//             <div className="analytics-grid">
//               <div className="analytics-card revenue-chart">
//                 <h3>Revenue Trends</h3>
//                 <div className="chart-placeholder">
//                   <div className="chart-content">
//                     <div className="chart-icon">📈</div>
//                     <p>Revenue Chart</p>
//                     <div className="chart-stats">
//                       <div className="chart-stat">
//                         <span>Today: ₹{dashboardStats.todayRevenue}</span>
//                       </div>
//                       <div className="chart-stat">
//                         <span>This Month: ₹{dashboardStats.monthlyRevenue}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="analytics-card order-stats">
//                 <h3>Order Statistics</h3>
//                 <div className="order-breakdown">
//                   <div className="breakdown-item">
//                     <span className="breakdown-label">Completed</span>
//                     <span className="breakdown-value">{dashboardStats.completedOrders}</span>
//                     <div className="breakdown-bar">
//                       <div className="breakdown-fill completed" style={{ width: "70%" }}></div>
//                     </div>
//                   </div>
//                   <div className="breakdown-item">
//                     <span className="breakdown-label">In Progress</span>
//                     <span className="breakdown-value">1</span>
//                     <div className="breakdown-bar">
//                       <div className="breakdown-fill in-progress" style={{ width: "20%" }}></div>
//                     </div>
//                   </div>
//                   <div className="breakdown-item">
//                     <span className="breakdown-label">Pending</span>
//                     <span className="breakdown-value">{dashboardStats.pendingOrders}</span>
//                     <div className="breakdown-bar">
//                       <div className="breakdown-fill pending" style={{ width: "10%" }}></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="analytics-card top-performers">
//                 <h3>Top Performing Laundrymen</h3>
//                 <div className="performers-list">
//                   {laundrymen
//                     .filter((l) => l.status === "Active")
//                     .sort((a, b) => b.rating - a.rating)
//                     .slice(0, 3)
//                     .map((laundryman, index) => (
//                       <div key={laundryman.id} className="performer-item">
//                         <div className="performer-rank">#{index + 1}</div>
//                         <img
//                           src={laundryman.image || "/placeholder.svg"}
//                           alt={laundryman.name}
//                           className="performer-image"
//                         />
//                         <div className="performer-info">
//                           <h5>{laundryman.name}</h5>
//                           <p>
//                             {laundryman.rating} • {laundryman.completedOrders} orders
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>

//               <div className="analytics-card customer-insights">
//                 <h3>Customer Insights</h3>
//                 <div className="insights-content">
//                   <div className="insight-item">
//                     <span className="insight-label">Average Order Value</span>
//                     <span className="insight-value">
//                       ₹{Math.round(dashboardStats.totalRevenue / dashboardStats.totalOrders)}
//                     </span>
//                   </div>
//                   <div className="insight-item">
//                     <span className="insight-label">Customer Retention</span>
//                     <span className="insight-value">85%</span>
//                   </div>
//                   <div className="insight-item">
//                     <span className="insight-label">New Customers</span>
//                     <span className="insight-value">12 this month</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activePage === "Settings" && (
//           <div className="admin-settings-page">
//             <div className="page-header">
//               <h2>System Settings</h2>
//             </div>
//             <div className="settings-grid">
//               <div className="settings-card">
//                 <h3>Platform Settings</h3>
//                 <div className="setting-item">
//                   <label>Service Commission (%)</label>
//                   <input
//                     type="number"
//                     value={settings.commission}
//                     min="0"
//                     max="50"
//                     onChange={(e) => handleSettingChange("commission", Number.parseInt(e.target.value))}
//                   />
//                 </div>
//                 <div className="setting-item">
//                   <label>Minimum Order Amount</label>
//                   <input
//                     type="number"
//                     value={settings.minOrderAmount}
//                     min="50"
//                     onChange={(e) => handleSettingChange("minOrderAmount", Number.parseInt(e.target.value))}
//                   />
//                 </div>
//                 <div className="setting-item">
//                   <label>Maximum Service Radius (km)</label>
//                   <input
//                     type="number"
//                     value={settings.maxServiceRadius}
//                     min="5"
//                     max="100"
//                     onChange={(e) => handleSettingChange("maxServiceRadius", Number.parseInt(e.target.value))}
//                   />
//                 </div>
//                 <button className="save-btn" onClick={() => alert("Platform settings saved!")}>
//                   Save Changes
//                 </button>
//               </div>

//               <div className="settings-card">
//                 <h3>Notification Settings</h3>
//                 <div className="setting-item toggle">
//                   <label>Email Notifications</label>
//                   <div
//                     className={`toggle-switch ${settings.emailNotifications ? "enabled" : "disabled"}`}
//                     onClick={() => handleToggleSetting("emailNotifications")}
//                   >
//                     <div className="toggle-slider"></div>
//                   </div>
//                 </div>
//                 <div className="setting-item toggle">
//                   <label>SMS Notifications</label>
//                   <div
//                     className={`toggle-switch ${settings.smsNotifications ? "enabled" : "disabled"}`}
//                     onClick={() => handleToggleSetting("smsNotifications")}
//                   >
//                     <div className="toggle-slider"></div>
//                   </div>
//                 </div>
//                 <div className="setting-item toggle">
//                   <label>Push Notifications</label>
//                   <div
//                     className={`toggle-switch ${settings.pushNotifications ? "enabled" : "disabled"}`}
//                     onClick={() => handleToggleSetting("pushNotifications")}
//                   >
//                     <div className="toggle-slider"></div>
//                   </div>
//                 </div>
//                 <button className="save-btn" onClick={() => alert("Notification settings saved!")}>
//                   Save Changes
//                 </button>
//               </div>

//               <div className="settings-card">
//                 <h3>Service Areas</h3>
//                 <div className="service-areas-list">
//                   {serviceAreas.map((area, index) => (
//                     <div key={index} className="area-item">
//                       <span>{area}</span>
//                       <button className="remove-btn" onClick={() => handleRemoveServiceArea(index)}>
//                         Remove
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="add-area">
//                   <input
//                     type="text"
//                     placeholder="Add new service area"
//                     value={newArea}
//                     onChange={(e) => setNewArea(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && handleAddServiceArea()}
//                   />
//                   <button className="add-btn" onClick={handleAddServiceArea}>
//                     Add Area
//                   </button>
//                 </div>
//               </div>

//               <div className="settings-card">
//                 <h3>Backup & Security</h3>
//                 <div className="setting-item">
//                   <label>Last Backup</label>
//                   <span>2024-12-03 10:30 AM</span>
//                   <button className="backup-btn" onClick={handleCreateBackup}>
//                     Create Backup
//                   </button>
//                 </div>
//                 <div className="setting-item">
//                   <label>Two-Factor Authentication</label>
//                   <button className="enable-btn" onClick={handleEnable2FA}>
//                     Enable 2FA
//                   </button>
//                 </div>
//                 <div className="setting-item">
//                   <label>Session Timeout (minutes)</label>
//                   <input
//                     type="number"
//                     value={settings.sessionTimeout}
//                     min="15"
//                     max="120"
//                     onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
//                   />
//                 </div>
//                 <button className="save-btn" onClick={() => alert("Security settings saved!")}>
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>






//       {/* Assign Order Modal */}
//       {showAssignOrderModal && selectedOrder && (
//         <div className="order-modal">
//           <div className="modal-header">
//             <span className="order-id">#{selectedOrder.id}</span>
//             <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>
//               {selectedOrder.status}
//             </span>
//             <span className="total-amount">₹{selectedOrder.totalAmount}</span>
//           </div>
//           <div className="modal-content">
//             <div className="order-details">
//               <div className="order-info-grid">
//                 <div className="info-item">
//                   <label>Customer</label>
//                   <span>{selectedOrder.customerName}</span>
//                 </div>
//                 <div className="info-item">
//                   <label>Dhobi</label>
//                   <span>{selectedOrder.laundrymanName || "Not Assigned"}</span>
//                 </div>
//                 <div className="info-item">
//                   <label>Order Date</label>
//                   <span>{selectedOrder.orderDate}</span>
//                 </div>
//                 {/* <div className="info-item">
//                   <label>pick Date</label>
//                   <span>{selectedOrder.date || "Not Set"}</span>
//                 </div>
//                 <div className="info-item">
//                   <label>Time Slot</label>
//                   <span>{selectedOrder.timeSlot || "Not Set"}</span>
//                 </div> */}


//                 <div className="info-item">
//                   <label>Pickup Date</label>
//                   <span>{selectedOrder.pickupDate || "Not Set"}</span>
//                 </div>

//                 <div className="info-item">
//                   <label>Time Slot</label>
//                   <span>
//                     {selectedOrder.timeSlotLabel
//                       ? `${selectedOrder.timeSlotLabel} (${selectedOrder.timeSlot})`
//                       : selectedOrder.timeSlot || "Not Set"}
//                   </span>
//                 </div>


//                 <div className="info-item">
//                   <label>Payment Method</label>
//                   <span>{selectedOrder.paymentMethod}</span>
//                 </div>
//                 <div className="info-item">
//                   <label>Payment Status</label>
//                   <span className={`status-badge ${selectedOrder.paymentStatus.toLowerCase()}`}>
//                     {selectedOrder.paymentStatus}
//                   </span>
//                 </div>
//                 <div className="info-item">
//                   <label>Current Status</label>
//                   <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>
//                     {selectedOrder.status}
//                   </span>
//                 </div>
//               </div>
//               <div className="order-items">
//                 <h4>Order Items</h4>
//                 <ul>
//                   {selectedOrder.items.map((item, index) => (
//                     <li key={index}>
//                       {item.quantity} x {item.product.title} ({item.product.category})
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//             </div>
//           </div>
//         </div>
//       )}

//       {/* User Dashboard Modal */}
//       {showUserDashboardModal && selectedUserDashboard && (
//         <div className="modal-overlay" onClick={() => setShowUserDashboardModal(false)}>
//           <div className="user-dashboard-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>{selectedUserDashboard.name} - Dashboard</h3>
//               <button className="close-btn" onClick={() => setShowUserDashboardModal(false)}>
//                 ×
//               </button>
//             </div>
//             <div className="modal-content">
//               <div className="dashboard-overview">
//                 <div className="user-profile-section">
//                   {/* <img
//                     src={selectedUserDashboard.image || "/placeholder.svg"}
//                     alt={selectedUserDashboard.name}
//                     className="dashboard-user-image"
//                   /> */}
//                   <div className="user-basic-info">
//                     <h4>{selectedUserDashboard.name}</h4>
//                     <p>{selectedUserDashboard.email}</p>
//                     <span className={`status-badge ${selectedUserDashboard.status.toLowerCase()}`}>
//                       {selectedUserDashboard.status}
//                     </span>
//                   </div>
//                 </div>

//                 {selectedUserDashboard.userType === "customer" ? (
//                   <div className="customer-dashboard">
//                     <div className="dashboard-stats-grid">
//                       <div className="dashboard-stat">
//                         <div className="stat-icon">📦</div>
//                         <div className="stat-info">
//                           <h5>Total Orders</h5>
//                           <span>{selectedUserDashboard.totalOrders}</span>
//                         </div>
//                       </div>
//                       <div className="dashboard-stat">
//                         <div className="stat-icon">₹</div>
//                         <div className="stat-info">
//                           <h5>Total Spent</h5>
//                           <span>₹{selectedUserDashboard.totalSpent}</span>
//                         </div>
//                       </div>
//                       <div className="dashboard-stat">
//                         <div className="stat-icon">🎯</div>
//                         <div className="stat-info">
//                           <h5>Loyalty Points</h5>
//                           <span>{selectedUserDashboard.loyaltyPoints}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="customer-orders">
//                       <h5>Recent Orders</h5>
//                       <div className="orders-list">
//                         {orders
//                           .filter((order) => order.customerId === selectedUserDashboard.id)
//                           .slice(0, 5)
//                           .map((order) => (
//                             <div key={order.id} className="order-item">
//                               <div className="order-info">
//                                 <span className="order-id">{order.id}</span>
//                                 <span className="order-date">{order.orderDate}</span>
//                               </div>
//                               <div className="order-details">
//                                 <span className="order-amount">₹{order.totalAmount}</span>
//                                 <span className={`status-badge ${order.status.toLowerCase().replace(" ", "-")}`}>
//                                   {order.status}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                     </div>

//                     <div className="customer-preferences">
//                       <h5>Preferences</h5>
//                       <div className="preferences-list">
//                         {selectedUserDashboard.preferences.map((pref, index) => (
//                           <span key={index} className="preference-tag">
//                             {pref}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="laundryman-dashboard">
//                     <div className="laundryman-info-card">
//                       <h4>Dhobi Details</h4>
//                       <div className="info-row"><strong>Name:</strong> {selectedUserDashboard.name}</div>
//                       <div className="info-row"><strong>Email:</strong> {selectedUserDashboard.email}</div>
//                       <div className="info-row"><strong>Contact:</strong> {selectedUserDashboard.contact}</div>
//                       <div className="info-row"><strong>Joined On:</strong> {new Date(selectedUserDashboard.createdAt).toLocaleDateString()}</div>

//                     </div>
//                     <div className="dashboard-stats-grid">
//                       <div className="dashboard-stat">
//                         <div className="stat-icon">✅</div>
//                         <div className="stat-info">
//                           <h5>total Order</h5>
//                           <span>{selectedUserDashboard.totalOrders}</span>
//                         </div>
//                       </div>
//                       {/* <div className="dashboard-stat">
//                         <div className="stat-icon"></div>
//                         <div className="stat-info">
//                           <h5>Rating</h5>
//                           <span>{selectedUserDashboard.rating}</span>
//                         </div>
//                       </div> */}
//                       <div className="dashboard-stat">
//                         <div className="stat-icon">₹</div>
//                         <div className="stat-info">
//                           <h5>Earnings</h5>
//                           <span>₹{selectedUserDashboard.earnings}</span>
//                         </div>
//                       </div>
//                       <div className="dashboard-stat">
//                         <div className="stat-icon">📋</div>
//                         <div className="stat-info">
//                           <h5>Complete order</h5>
//                           <span>
//                             {selectedUserDashboard.completedOrders}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="laundryman-orders">
//                       <h5>Assigned Orders</h5>
//                       <div className="orders-list">
//                         {orders
//                           .filter((order) => order.laundrymanId === selectedUserDashboard.id)
//                           .slice(0, 5)
//                           .map((order) => (
//                             <div key={order.id} className="order-item">
//                               <div className="order-info">
//                                 <span className="order-id">{order.id}</span>
//                                 <span className="customer-name">{order.customerName}</span>
//                               </div>
//                               <div className="order-details">
//                                 <span className="order-amount">₹{order.totalAmount}</span>
//                                 <span className={`status-badge ${order.status.toLowerCase().replace(" ", "-")}`}>
//                                   {order.status}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                     </div>
// {/*                     <div className="laundryman-schedule">
//                       <h5>Working Hours</h5>
//                       <div className="schedule-list">
//                         {Array.isArray(selectedUserDashboard.workingHours) &&
//                           selectedUserDashboard.workingHours.length > 0 ? (
//                           selectedUserDashboard.workingHours.map((hour, index) => (
//                             <span key={index} className="hour-tag">
//                               {hour}
//                             </span>
//                           ))
//                         ) : (
//                           <span className="text-sm text-gray-500">No working hours available</span>
//                         )}
//                       </div>
//                     </div>
//  */}

// {/*                     <div className="laundryman-specialties">
//                       <h5>Specialties</h5>
//                       <div className="specialties-list">
//                         {selectedUserDashboard.specialties.map((specialty, index) => (
//                           <span key={index} className="specialty-tag">
//                             {specialty}
//                           </span>
//                         ))}
//                       </div>
//                     </div> */}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Time Slot Modal */}
//       {showTimeSlotModal && (
//         <div className="modal-overlay" onClick={() => setShowTimeSlotModal(false)}>
//           <div className="timeslot-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Add New Time Slot</h3>
//               <button className="close-btn" onClick={() => setShowTimeSlotModal(false)}>×</button>
//             </div>
//             <div className="modal-content">
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   const formData = new FormData(e.target);
//                   const newSlot = {
//                     label: formData.get("label"),
//                     range: formData.get("range"),
//                   };
//                   handleAddTimeSlot(newSlot);
//                   setShowTimeSlotModal(false);
//                 }}
//               >
//                 <div className="form-group">
//                   <label>Label</label>
//                   <input name="label" type="text" required placeholder="e.g., Morning" />
//                 </div>
//                 <div className="form-group">
//                   <label>Time Range</label>
//                   <input
//                     name="range"
//                     type="text"
//                     required
//                     placeholder="e.g., 07:00-09:00"
//                     pattern="[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}"
//                   />
//                 </div>
//                 <div className="form-buttons">
//                   <button type="submit" className="save-btn">Add Slot</button>
//                   <button type="button" className="cancel-btn" onClick={() => setShowTimeSlotModal(false)}>Cancel</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Time Slot Modal */}
//       {showEditTimeSlotModal && selectedTimeSlot && (
//         <div className="modal-overlay" onClick={() => setShowEditTimeSlotModal(false)}>
//           <div className="timeslot-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Edit Time Slot</h3>
//               <button className="close-btn" onClick={() => setShowEditTimeSlotModal(false)}>
//                 ×
//               </button>
//             </div>
//             <div className="modal-content">
//               <form onSubmit={handleSaveTimeSlotEdit}>
//                 <div className="form-group">
//                   <label>Time Slot</label>
//                   <input
//                     name="slot"
//                     type="text"
//                     required
//                     defaultValue={selectedTimeSlot.slot}
//                     placeholder="e.g., 09:00-12:00"
//                     pattern="[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Maximum Orders</label>
//                   <input
//                     name="maxOrders"
//                     type="number"
//                     required
//                     min="1"
//                     max="50"
//                     defaultValue={selectedTimeSlot.maxOrders}
//                     placeholder="Enter maximum orders for this slot"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Current Orders</label>
//                   <input
//                     type="number"
//                     value={selectedTimeSlot.currentOrders}
//                     disabled
//                     className="disabled-input"
//                   />
//                   <small className="form-help">Current orders cannot be modified directly</small>
//                 </div>
//                 <div className="form-buttons">
//                   <button type="submit" className="save-btn">
//                     Save Changes
//                   </button>
//                   <button type="button" className="cancel-btn" onClick={() => setShowEditTimeSlotModal(false)}>
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* User Details Modal */}
//       {showUserModal && selectedUser && (
//         <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
//           <div className="user-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>{selectedUser.userType === "customer" ? "Customer" : "Laundryman"} Details</h3>
//               <button className="close-btn" onClick={() => setShowUserModal(false)}>
//                 ×
//               </button>
//             </div>
//             <div className="modal-content">
//               <div className="user-details">
//                 <img
//                   src={selectedUser.image || "/placeholder.svg"}
//                   alt={selectedUser.name}
//                   className="user-detail-image"
//                 />
//                 <div className="user-info-grid">
//                   <div className="info-item">
//                     <label>Name</label>
//                     <span>{selectedUser.name}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Email</label>
//                     <span>{selectedUser.email}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Phone</label>
//                     <span>{selectedUser.phone}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Address</label>
//                     <span>{selectedUser.address}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Join Date</label>
//                     <span>{selectedUser.joinDate}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Status</label>
//                     <span className={`status-badge ${selectedUser.status.toLowerCase()}`}>{selectedUser.status}</span>
//                   </div>

//                   {selectedUser.userType === "customer" && (
//                     <>
//                       <div className="info-item">
//                         <label>Total Orders</label>
//                         <span>{selectedUser.totalOrders}</span>
//                       </div>
//                       <div className="info-item">
//                         <label>Total Spent</label>
//                         <span>₹{selectedUser.totalSpent}</span>
//                       </div>
//                       <div className="info-item">
//                         <label>Preferences</label>
//                         <div className="preferences-list">
//                           {selectedUser.preferences.map((pref, index) => (
//                             <span key={index} className="preference-tag">
//                               {pref}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {selectedUser.userType === "laundryman" && (
//                     <>
//                       <div className="info-item">
//                         <label>Rating</label>
//                         <span> {selectedUser.rating}</span>
//                       </div>
//                       <div className="info-item">
//                         <label>Completed Orders</label>
//                         <span>{selectedUser.completedOrders}</span>
//                       </div>
//                       <div className="info-item">
//                         <label>Current Orders</label>
//                         <span>
//                           {selectedUser.currentOrders}/{selectedUser.maxOrders}
//                         </span>
//                       </div>
//                       <div className="info-item">
//                         <label>Earnings</label>
//                         <span>₹{selectedUser.earnings}</span>
//                       </div>
//                       <div className="info-item">
//                         <label>Availability</label>
//                         <span className={`availability-badge ${selectedUser.availability.toLowerCase()}`}>
//                           {selectedUser.availability}
//                         </span>
//                       </div>
//                       <div className="info-item">
//                         <label>Working Hours</label>
//                         <div className="hours-list">
//                           {selectedUser.workingHours.map((hour, index) => (
//                             <span key={index} className="hour-tag">
//                               {hour}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                       <div className="info-item">
//                         <label>Specialties</label>
//                         <div className="specialties-list">
//                           {selectedUser.specialties.map((specialty, index) => (
//                             <span key={index} className="specialty-tag">
//                               {specialty}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Order Details Modal */}
//       {showOrderModal && selectedOrder && (
//         <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
//           <div className="order-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Order Details - {selectedOrder.id}</h3>
//               <button className="close-btn" onClick={() => setShowOrderModal(false)}>
//                 ×
//               </button>
//             </div>
//             <div className="modal-content">
//               <div className="order-details">
//                 <div className="order-info-grid">
//                   <div className="info-item">
//                     <label>Customer</label>
//                     <span>{selectedOrder.customerName}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Dhobi</label>
//                     <span>{selectedOrder.laundrymanName}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Order Date</label>
//                     <span>{selectedOrder.orderDate}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Pickup Date</label>
//                     <span>{selectedOrder.pickupDate || "Not Set"}</span>
//                   </div>

//                   <div className="info-item">
//                     <label>Time Slot</label>
//                     <span>
//                       {selectedOrder.timeSlotLabel
//                         ? `${selectedOrder.timeSlotLabel} (${selectedOrder.timeSlot})`
//                         : selectedOrder.timeSlot || "Not Set"}
//                     </span>
//                   </div>

//                   <div className="info-item">
//                     <label>Priority</label>
//                     <span className={`priority-badge ${selectedOrder.priority.toLowerCase()}`}>
//                       {selectedOrder.priority}
//                     </span>
//                   </div>
//                   <div className="info-item">
//                     <label>Total Amount</label>
//                     <span>₹{selectedOrder.totalAmount}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Payment Method</label>
//                     <span>{selectedOrder.paymentMethod}</span>
//                   </div>
//                   <div className="info-item">
//                     <label>Payment Status</label>
//                     <span className={`status-badge ${selectedOrder.paymentStatus.toLowerCase()}`}>
//                       {selectedOrder.paymentStatus}
//                     </span>
//                   </div>
//                   <div className="info-item">
//                     <label>Order Status</label>
//                     <span className={`status-badge ${selectedOrder.status.toLowerCase().replace(" ", "-")}`}>
//                       {selectedOrder.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="order-items">
//                   <h4>Items</h4>
//                   <ul>
//                     {selectedOrder.items.map((item, index) => (
//                       <li key={index}>{item}</li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Logout Confirmation Popup */}
//       {showLogoutPopup && (
//         <div className="logout-popup-overlay">
//           <div className="logout-popup-content">
//             <h3>Confirm Logout</h3>
//             <p>Are you sure you want to logout?</p>
//             <div className="logout-popup-buttons">
//               <button className="confirm-btn" onClick={confirmLogout}>
//                 Yes, Logout
//               </button>
//               <button className="cancel-btn" onClick={cancelLogout}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// const generateNextNDates = (n) => {
//   const dates = [];
//   const today = new Date();
//   for (let i = 0; i < n; i++) {
//     const date = new Date(today);
//     date.setDate(date.getDate() + i);
//     dates.push(date.toISOString().split("T")[0]);
//   }
//   return dates;
// };

// const SlotTemplateManager = () => {
//   const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
//   const [slots, setSlots] = useState([]);
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [allSlotTemplates, setAllSlotTemplates] = useState([]);

//   const allDates = generateNextNDates(10);

//   const handleAddTimeSlot = (newSlot) => {
//     setSlots((prev) => [...prev, newSlot]);
//   };

//   const handleCheckboxChange = (date) => {
//     setSelectedDates((prev) =>
//       prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
//     );
//   };

//   const handleSubmit = async () => {
//     if (selectedDates.length === 0 || slots.length === 0) {
//       alert("Please select dates and add at least one slot.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "/api/slots",
//         { dates: selectedDates, slots },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Slot templates saved successfully.");
//       setSlots([]);
//       setSelectedDates([]);
//       fetchAllSlotTemplates();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save slot templates.");
//     }
//   };

//   const fetchAllSlotTemplates = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("/api/slot-templates", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAllSlotTemplates(res.data);
//     } catch (err) {
//       console.error("Failed to fetch slot templates:", err);
//     }
//   };

//   useEffect(() => {
//     console.log(4);
//     fetchAllSlotTemplates();
//   }, []);

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-white shadow-xl rounded-2xl mt-6">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Slot Template Manager</h2>

//       {/* Date Selection */}
//       <div className="mb-8">
//         <h4 className="text-lg font-semibold mb-3">Select Dates</h4>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
//           {allDates.map((date) => (
//             <label key={date} className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={selectedDates.includes(date)}
//                 onChange={() => handleCheckboxChange(date)}
//                 className="accent-blue-500"
//               />
//               <span className="text-sm">{date}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Defined Slots */}
//       <div className="mb-8">
//         <h4 className="text-lg font-semibold mb-3">Defined Slots</h4>
//         {slots.length > 0 ? (
//           <ul className="list-disc list-inside text-gray-700 mb-4">
//             {slots.map((slot, idx) => (
//               <li key={idx}>
//                 <strong>{slot.label}</strong> - {slot.range}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-sm text-gray-500 mb-4">No slots added yet.</p>
//         )}
//         <button
//           onClick={() => setShowTimeSlotModal(true)}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           + Add Time Slot
//         </button>
//       </div>

//       {/* Save Button */}
//       <div className="text-right">
//         <button
//           onClick={handleSubmit}
//           className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//         >
//           Save Slot Templates
//         </button>
//       </div>

//       {/* Modal */}
//       {showTimeSlotModal && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//           onClick={() => setShowTimeSlotModal(false)}
//         >
//           <div
//             className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold">Add New Time Slot</h3>
//               <button
//                 onClick={() => setShowTimeSlotModal(false)}
//                 className="text-gray-500 hover:text-gray-800"
//               >
//                 ×
//               </button>
//             </div>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 const formData = new FormData(e.target);
//                 const newSlot = {
//                   label: formData.get("label"),
//                   range: formData.get("range"),
//                 };
//                 handleAddTimeSlot(newSlot);
//                 setShowTimeSlotModal(false);
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Label</label>
//                 <input
//                   name="label"
//                   type="text"
//                   required
//                   placeholder="e.g., Morning"
//                   className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Time Range</label>
//                 <input
//                   name="range"
//                   type="text"
//                   required
//                   placeholder="e.g., 07:00-09:00"
//                   pattern="[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}"
//                   className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowTimeSlotModal(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   Add Slot
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* All Slot Templates Display */}
//       {allSlotTemplates.length > 0 && (
//         <div className="mt-10">
//           <h4 className="text-lg font-semibold mb-4 text-gray-800">All Slot Templates</h4>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {allSlotTemplates.map((template, index) => (
//               <div
//                 key={index}
//                 className="p-4 border rounded-lg shadow-sm bg-gray-50"
//               >
//                 <p className="text-sm font-medium text-blue-700 mb-2">
//                   📅 Date: {template.date}
//                 </p>
//                 {template.slots?.map((slot, idx) => (
//                   <p key={idx} className="text-sm text-gray-700">
//                     • {slot.label}: {slot.range}
//                   </p>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard





























"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./AdminDashboard.css"
import { useEffect } from "react"
import axios from "../utilss/axios" // Adjust the import path as necessary  
import { Menu, X } from "lucide-react"
import SlotTemplateManagerComponent from "../components/SlotTemplateManagers"
import AdminMessagesComponent from "../pagess/AdminMessages"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Add mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@laundryservice.com",
    role: "Super Admin",
    phone: "+1-234-567-8900",
    address: "123 Admin Street, Business District",
    joinDate: "2024-01-01",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  })

  const [activePage, setActivePage] = useState("Dashboard")
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [orderFilter, setOrderFilter] = useState("All Orders")
  const [dateFilter, setDateFilter] = useState("")
  const [analyticsFilter, setAnalyticsFilter] = useState("Last 7 Days")
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false)
  const [showAddLaundrymanModal, setShowAddLaundrymanModal] = useState(false)
  const [showAssignOrderModal, setShowAssignOrderModal] = useState(false)
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false)
  const [showEditTimeSlotModal, setShowEditTimeSlotModal] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [showUserDashboardModal, setShowUserDashboardModal] = useState(false)
  const [selectedUserDashboard, setSelectedUserDashboard] = useState(null)
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [laundrymanSearchTerm, setLaundrymanSearchTerm] = useState("")
  const [timeSlots, setTimeSlots] = useState([]);

  const [newSlot, setNewSlot] = useState({ slot: "", maxOrders: 20 });


  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);



  // State for customers and laundrymen
  const [profile, setProfile] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [laundrymen, setLaundrymen] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);



  // ✅ Place this at the top of your file, before the component definition
  // Helper function to format enabled slots into readable working hours
  function getWorkingHoursFromSlots(slots) {
    if (!Array.isArray(slots) || slots.length === 0) return "N/A";

    const ranges = slots
      .filter(s => s.isEnabled)
      .map(s => s.label || `${s.start} - ${s.end}`); // fallback if label missing

    return ranges.join(", ");
  }



  // Mobile menu toggle function
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when clicking on navigation items
  const handleNavClick = (page) => {
    setActivePage(page)
    setIsMobileMenuOpen(false) // Close mobile menu
  }

  // Close mobile menu when clicking overlay
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   console.log(1)
  //   console.log(token);

  //   const fetchCustomers = async () => {
  //     try {
  //       console.log("Fetching customers from backend...");
  //       const res = await axios.get("http://localhost:5000/api/user/", {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       setCustomers(res.data || []);
  //     } catch (error) {
  //       console.error("Error fetching customers:", error);
  //     }
  //   };

  //   const fetchProfile = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:5000/api/user/currentuser", {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       setProfile({
  //         name: res.data.name,
  //         email: res.data.email,
  //         contact: res.data.contact,
  //         image: "/src/washer.png",
  //         _id: res.data._id,
  //       });
  //     } catch (err) {
  //       console.error("Failed to fetch profile:", err);
  //     }
  //   };

  //   const fetchLaundrymen = async () => {
  //     try {
  //       console.log("Fetching laundrymen from backend...");
  //       const res = await axios.get("http://localhost:5000/api/washerman", {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       const transformedLaundrymen = (res.data || []).map((l) => ({
  //         id: l.id || l._id || "",
  //         name: l.name || "",
  //         email: l.email || "",
  //         phone: l.phone || "",
  //         address: l.address || "",
  //         image: l.image || "",
  //         specialties: Array.isArray(l.specialties) ? l.specialties : [],
  //         workingHours: Array.isArray(l.workingHours) ? l.workingHours : [],
  //         maxOrders: typeof l.maxOrders === "number" ? l.maxOrders : 0,
  //         completedOrders: typeof l.completedOrders === "number" ? l.completedOrders : 0,
  //         rating: typeof l.rating === "number" ? l.rating : 0,
  //         status: l.status || "Active",
  //         earnings: typeof l.earnings === "number" ? l.earnings : 0,
  //         availability: l.availability || "Available",
  //         currentOrders: typeof l.currentOrders === "number" ? l.currentOrders : 0,
  //         joinDate: l.joinDate || "",
  //       }));
  //       setLaundrymen(transformedLaundrymen);
  //     } catch (error) {
  //       console.error("Error fetching laundrymen:", error);
  //     }
  //   };

  //   const fetchAll = async () => {
  //     setLoading(true);
  //     await Promise.all([fetchCustomers(), fetchLaundrymen()]);
  //     setLoading(false);
  //   };

  //   let profile = {};
  //   async () => {
  //     profile = await fetchProfile();
  //   }
  //   console.log(profile)

  //   fetchAll();
  // }, []);



  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/currentuser", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = res.data;
        setProfile({
          name: user.name,
          email: user.email,
          contact: user.contact,
          image: "/src/washer.png",
          _id: user._id,
        });
        console.log("Profile fetched:", user);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    const fetchCustomers = async () => {
      try {
        console.log("Fetching customers...");
        const res = await axios.get("/api/user/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(res.data || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const fetchLaundrymen = async () => {
      try {
        console.log("Fetching laundrymen...");
        const res = await axios.get("/api/washerman/dashboard/all", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const transformed = (res.data || []).map((l) => ({
          id: l.id || l._id || "",
          name: l.name || "",
          email: l.email || "",
          address: l.address || "",
          image: l.image || "/src/washer.png",
          specialties: Array.isArray(l.specialties) ? l.specialties : [],
          workingHours: Array.isArray(l.workingHours) ? l.workingHours : [],
          maxOrders: l.maxOrders ?? 0,
          totalOrders: l.totalOrders ?? 0,
          completedOrders: l.completedOrders ?? 0,
          rating: l.rating ?? 0,
          status: l.status || "Active",
          earnings: l.earnings ?? 0,
          availability: l.availability || "Available",
          contact: l.contact || "",                      // ✅ correct field
          createdAt: l.createdAt || "",
        }));

        setLaundrymen(transformed);
      } catch (error) {
        console.error("Error fetching laundrymen:", error);
      }
    };


    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchCustomers(), fetchLaundrymen()]);
      setLoading(false);
    };

    fetchAll();
  }, []);



  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(2);

    const fetchAllBookings = async () => {
      try {
        const res = await axios.get("/api/booking/all", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Bookings from backend:", res.data);

        const bookings = (res.data || []).map((b) => ({
          id: b._id || b.id,
          customerId: b.guest?._id || "",
          customerName: b.guest?.name || "Unassigned",
          laundrymanId: b.washerman?._id || "",
          laundrymanName: b.washerman?.name || "Unassigned",
          items: b.productId?.category
            ? [`${b.quantity} x ${b.productId.category}`]
            : ["Item"],
          totalAmount: b.totalAmount || 0,
          status: b.status || "Pending",
          pickupDate: b.date?.slice(0, 10) || "",   // ✅ using 'date' field for pickupDate
          timeSlot: b.slot?.range || "Not specified", // ✅ using slot.range
          timeSlotLabel: b.slot?.label || "",         // optional
          priority: b.priority || "Normal",
          orderDate: b.createdAt
            ? b.createdAt.slice(0, 10)
            : b.orderDate
              ? b.orderDate.slice(0, 10)
              : "",
          paymentMethod: b.paymentMethod || "Cash",
          paymentStatus: b.paymentStatus || "Pending"
        }));

        setOrders(bookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchAllBookings();
  }, []);

  // Time slots management
  const fetchTimeSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/slot-templates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const transformed = (res.data || []).map((slot) => ({
        id: slot._id,
        slot: slot.time || "Unnamed Slot",
        currentOrders: 0,
        maxOrders: 0,
        active: false,
      }));
      setTimeSlots(transformed);
    } catch (err) {
      console.error("Failed to fetch time slots", err);
    }
  };

  useEffect(() => {
    console.log(3);
    fetchTimeSlots();
  }, []);

  const handleAddTimeSlot = async (newSlot) => {
    try {
      const payload = {
        time: newSlot.slot,
        period: newSlot.slot
      };
      await axios.post("/api/slot", payload);
      await fetchTimeSlots();
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  // Settings state
  const [settings, setSettings] = useState({
    commission: 15,
    minOrderAmount: 100,
    maxServiceRadius: 25,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    sessionTimeout: 30,
  })

  const [serviceAreas, setServiceAreas] = useState(["Downtown Mumbai", "Andheri", "Bandra"])
  const [newArea, setNewArea] = useState("")

  // Dashboard statistics
  const dashboardStats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter((c) => c.status === "Active").length,
    totalLaundrymen: laundrymen.length,
    activeLaundrymen: laundrymen.filter((l) => l.status === "Active").length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "Pending").length,
    completedOrders: orders.filter((o) => o.status === "Delivered").length,
    unassignedOrders: orders.filter((o) => !o.laundrymanId).length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    todayRevenue: 2400,
    monthlyRevenue: 45000,
  }

  // Filter functions
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()),
  )

  const filteredLaundrymen = laundrymen.filter(
    (laundryman) =>
      laundryman.name.toLowerCase().includes(laundrymanSearchTerm.toLowerCase()) ||
      laundryman.email.toLowerCase().includes(laundrymanSearchTerm.toLowerCase()),
  )

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderFilter === "All Orders" || order.status === orderFilter
    const matchesDate = !dateFilter || order.orderDate === dateFilter
    return matchesStatus && matchesDate
  })

  const handleUserAction = (userId, action, userType) => {
    if (userType === "customer") {
      setCustomers(
        customers.map((customer) =>
          customer.id === userId ? { ...customer, status: action === "activate" ? "Active" : "Inactive" } : customer,
        ),
      )
    } else {
      setLaundrymen(
        laundrymen.map((laundryman) =>
          laundryman.id === userId
            ? { ...laundryman, status: action === "activate" ? "Active" : "Inactive" }
            : laundryman,
        ),
      )
    }
  }

  const handleViewUser = (user, userType) => {
    setSelectedUser({ ...user, userType })
    setShowUserModal(true)
  }

  const handleViewUserDashboard = (user, userType) => {
    setSelectedUserDashboard({ ...user, userType })
    setShowUserDashboardModal(true)
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    setShowOrderModal(false)
  }

  const handleAssignOrder = (orderId, laundrymanId) => {
    const laundryman = laundrymen.find((l) => l.id === laundrymanId)
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, laundrymanId, laundrymanName: laundryman.name, status: "Assigned" } : order,
      ),
    )
    setShowAssignOrderModal(false)
  }

  const handleAddCustomer = (customerData) => {
    const newCustomer = {
      id: `CUST${String(customers.length + 1).padStart(3, "0")}`,
      ...customerData,
      joinDate: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      status: "Active",
      lastOrder: null,
      loyaltyPoints: 0,
    }
    setCustomers([...customers, newCustomer])
    setShowAddCustomerModal(false)
  }

  const handleAddLaundryman = (laundrymanData) => {
    const newLaundryman = {
      id: `LAUN${String(laundrymen.length + 1).padStart(3, "0")}`,
      ...laundrymanData,
      joinDate: new Date().toISOString().split("T")[0],
      completedOrders: 0,
      rating: 0,
      status: "Active",
      earnings: 0,
      availability: "Available",
      currentOrders: 0,
    }
    setLaundrymen([...laundrymen, newLaundryman])
    setShowAddLaundrymanModal(false)
  }

  const handleEditTimeSlot = (slot) => {
    setSelectedTimeSlot(slot)
    setShowEditTimeSlotModal(true)
  }

  const handleSaveTimeSlotEdit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const updatedSlot = {
      ...selectedTimeSlot,
      slot: formData.get("slot"),
      maxOrders: parseInt(formData.get("maxOrders")),
    }

    setTimeSlots(timeSlots.map((slot) =>
      slot.id === selectedTimeSlot.id ? updatedSlot : slot
    ))

    setShowEditTimeSlotModal(false)
    setSelectedTimeSlot(null)
  }

  const handleProfileEdit = () => {
    setIsEditingProfile(true)
    setActivePage("Profile")
    setPreviewImage(adminProfile.image)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const imageFile = e.target.image.files[0]

    if (imageFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAdminProfile({
          ...adminProfile,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          image: reader.result,
        })
        setIsEditingProfile(false)
        setActivePage("Dashboard")
      }
      reader.readAsDataURL(imageFile)
    } else {
      setAdminProfile({
        ...adminProfile,
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        image: previewImage || adminProfile.image,
      })
      setIsEditingProfile(false)
      setActivePage("Dashboard")
    }
  }

  const handleSettingChange = (setting, value) => {
    setSettings({ ...settings, [setting]: value })
  }

  const handleToggleSetting = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] })
  }

  const handleAddServiceArea = () => {
    if (newArea.trim() && !serviceAreas.includes(newArea.trim())) {
      setServiceAreas([...serviceAreas, newArea.trim()])
      setNewArea("")
    }
  }

  const handleRemoveServiceArea = (index) => {
    setServiceAreas(serviceAreas.filter((_, i) => i !== index))
  }

  const handleCreateBackup = () => {
    alert("Backup created successfully!")
  }

  const handleEnable2FA = () => {
    alert("Two-Factor Authentication setup would be implemented here")
  }

  const handleLogout = () => {
    setShowLogoutPopup(true)
  }

  const confirmLogout = () => {
    setShowLogoutPopup(false)
    navigate("/SignIn")
  }

  const cancelLogout = () => {
    setShowLogoutPopup(false)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <div className="admin-dashboard-container">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-logo">
            <span className="logo-icon">🧺</span>
            <span className="logo-text">LaundryAdmin</span>
          </div>
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header desktop-only">
          <div className="admin-logo">
            <span className="logo-icon">🧺</span>
            <span className="logo-text">LaundryAdmin</span>
          </div>
        </div>
        <div className="admin-sidebar-profile" onClick={handleProfileEdit}>
          <img src={adminProfile.image || "/placeholder.svg"} alt="Admin" className="admin-profile-img" />
          <div className="admin-profile-info">
            <span className="admin-profile-name">{adminProfile.name}</span>
            <span className="admin-profile-role">{adminProfile.role}</span>
          </div>
        </div>
        <nav className="admin-nav">
          <button className={activePage === "Dashboard" ? "active" : ""} onClick={() => handleNavClick("Dashboard")}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button className={activePage === "Customers" ? "active" : ""} onClick={() => handleNavClick("Customers")}>
            <span className="nav-icon">👥</span>
            <span className="nav-text">Customers</span>
          </button>
          <button className={activePage === "Laundrymen" ? "active" : ""} onClick={() => handleNavClick("Laundrymen")}>
            <span className="nav-icon">👨‍💼</span>
            <span className="nav-text">Dhobi</span>
          </button>
          <button className={activePage === "Orders" ? "active" : ""} onClick={() => handleNavClick("Orders")}>
            <span className="nav-icon">📦</span>
            <span className="nav-text">Orders</span>
          </button>
          <button
            className={activePage === "TimeSlots" ? "active" : ""}
            onClick={() => handleNavClick("TimeSlots")}
          >
            <span className="nav-icon">⏰</span>
            <span className="nav-text">Time Slots</span>
          </button>
          <button
            className={activePage === "Messages" ? "active" : ""}
            onClick={() => handleNavClick("Messages")}
          >
            <span className="nav-icon">💬</span>
            <span className="nav-text">Contact Messages</span>
          </button>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        {activePage === "Dashboard" && (
          <div className="admin-dashboard-page">
            {/* Welcome Section */}
            <section className="admin-welcome-section">
              <div className="welcome-content">
                <h1>
                  {getGreeting()}, {adminProfile.name}! 👋
                </h1>
                <p>Here's an overview of your laundry service platform</p>
              </div>
              <div className="admin-date-time">
                <div className="current-date">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="current-time">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </section>

            {/* Dashboard Statistics */}
            <section className="admin-stats-section">
              <div className="admin-stats-grid">
                <div className="admin-stat-card customers">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h3>Total Customers</h3>
                    <p className="stat-number">{dashboardStats.totalCustomers}</p>
                    <span className="stat-label">{dashboardStats.activeCustomers} Active</span>
                  </div>
                </div>
                <div className="admin-stat-card laundrymen">
                  <div className="stat-icon">👨‍💼</div>
                  <div className="stat-content">
                    <h3>Dhobi</h3>
                    <p className="stat-number">{dashboardStats.totalLaundrymen}</p>
                    <span className="stat-label">{dashboardStats.activeLaundrymen} Active</span>
                  </div>
                </div>
                <div className="admin-stat-card orders">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{dashboardStats.totalOrders}</p>
                    <span className="stat-label">{dashboardStats.pendingOrders} Pending</span>
                  </div>
                </div>
                <div className="admin-stat-card unassigned">
                  <div className="stat-icon">⚠️</div>
                  <div className="stat-content">
                    <h3>Unassigned Orders</h3>
                    <p className="stat-number">{dashboardStats.unassignedOrders}</p>
                    <span className="stat-label">Need Assignment</span>
                  </div>
                </div>
                <div className="admin-stat-card revenue">
                  <div className="stat-icon">₹</div>
                  <div className="stat-content">
                    <h3>Total order amount</h3>
                    <p className="stat-number">₹{dashboardStats.totalRevenue.toLocaleString()}</p>
                    <span className="stat-label">This Month</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="admin-quick-actions">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <button className="quick-action-btn" onClick={() => handleNavClick("Customers")}>
                  <div className="action-icon">👥</div>
                  <span>Manage Customers</span>
                </button>
                <button className="quick-action-btn" onClick={() => handleNavClick("Laundrymen")}>
                  <div className="action-icon">👨‍💼</div>
                  <span>Manage Dhobi</span>
                </button>
                <button className="quick-action-btn" onClick={() => handleNavClick("Orders")}>
                  <div className="action-icon">📦</div>
                  <span>View Orders</span>
                </button>
                <button className="quick-action-btn" onClick={() => handleNavClick("TimeSlots")}>
                  <div className="action-icon">⏰</div>
                  <span>Manage Time Slots</span>
                </button>
{/*                 <button className="quick-action-btn" onClick={() => handleNavClick("Analytics")}>
                  <div className="action-icon">📈</div>
                  <span>View Analytics</span>
                </button> */}
              </div>
            </section>


          </div>
        )}

        {activePage === "Profile" && (
          <div className="admin-profile-page">
            <div className="page-header">
              <h2>Admin Profile</h2>
              <button className="back-btn" onClick={() => handleNavClick("Dashboard")}>
                ← Back to Dashboard
              </button>
            </div>

            {isEditingProfile ? (
              <div className="edit-profile-section">
                <h3>Edit Profile</h3>
                <img
                  src={previewImage || adminProfile.image || "/placeholder.svg"}
                  alt="Profile Preview"
                  className="profile-image-preview"
                />
                <form onSubmit={handleSaveProfile} className="edit-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      defaultValue={adminProfile.name}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={adminProfile.email}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={adminProfile.phone}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      defaultValue={adminProfile.address}
                      required
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="image">Profile Image</label>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </div>
                  <div className="profile-buttons">
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setIsEditingProfile(false)
                        setActivePage("Dashboard")
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="profile-view-section">
                <div className="profile-card">
                  <div className="profile-image-section">
                    <img src={adminProfile.image || "/placeholder.svg"} alt="Admin Profile" className="profile-image" />
                    <button className="change-photo-btn" onClick={() => setIsEditingProfile(true)}>
                      Edit Profile
                    </button>
                  </div>
                  <div className="profile-info">
                    <div className="info-group">
                      <label>Full Name</label>
                      <p>{adminProfile.name}</p>
                    </div>
                    <div className="info-group">
                      <label>Email Address</label>
                      <p>{adminProfile.email}</p>
                    </div>
                    <div className="info-group">
                      <label>Phone Number</label>
                      <p>{adminProfile.phone}</p>
                    </div>
                    <div className="info-group">
                      <label>Role</label>
                      <p>{adminProfile.role}</p>
                    </div>
                    <div className="info-group">
                      <label>Address</label>
                      <p>{adminProfile.address}</p>
                    </div>
                    <div className="info-group">
                      <label>Join Date</label>
                      <p>{adminProfile.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activePage === "Customers" && (
          <div className="admin-customers-page">
            <div className="page-header">
              <h2>Customer Management</h2>
              <div className="header-actions">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="customers-grid">
              {filteredCustomers.map((customer) => (
                <div key={customer._id} className="customer-card">
                  {/* Header: Avatar + Info */}
                  <div className="customer-header">
                    <img
                      src="/profile.webp" // ✅ Fixed image from public folder
                      alt="User avatar"
                      className="customer-image w-16 h-16 rounded-full object-cover"
                    />
                    <div className="customer-info">
                      <h4>{customer.name}</h4>
                      <p>{customer.email}</p>
                    </div>
                  </div>

                  {/* Stats: Orders + Spent */}
                  <div className="customer-stats bg-gray-100 p-3 rounded-xl mt-2">
                    <div className="stat">
                      <span className="stat-label text-sm text-gray-500">Orders</span>
                      <span className="stat-value font-semibold">{customer.totalOrders || 0}</span>
                    </div>
                    {/* <div className="stat">
                      <span className="stat-label text-sm text-gray-500">pending</span>
                      <span className="stat-value font-semibold">{customer.pendingOrders || 0}</span>
                    </div> */}
                    <div className="stat">
                      <span className="stat-label text-sm text-gray-500">Spent</span>
                      <span className="stat-value font-semibold">₹{customer.totalSpent || 0}</span>
                    </div>
                  </div>

                  <button
                    className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowModal(true);
                    }}
                  >
                    View
                  </button>


                  {/* Optional: Preferences */}
                  {/* {customer.preferences?.length > 0 && (
                    <div className="customer-preferences mt-2">
                      <h5 className="text-sm font-medium mb-1">Preferences:</h5>
                      <div className="preferences-tags flex flex-wrap gap-1">
                        {customer.preferences.map((pref, index) => (
                          <span
                            key={index}
                            className="preference-tag bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        )}



        {showModal && selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold mb-4">Customer Details</h2>

              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {selectedCustomer.name}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Contact:</strong> {selectedCustomer.contact || "Not Provided"}</p>

                {/* Address breakdown */}
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedCustomer.address?.street || selectedCustomer.address?.city || selectedCustomer.address?.state
                    ? `${selectedCustomer.address?.street || ""}, ${selectedCustomer.address?.city || ""}, ${selectedCustomer.address?.state || ""}, ${selectedCustomer.address?.zip || ""}`
                    : "Not Provided"}
                </p>

                <p>
                  <strong>Joined On:</strong>{" "}
                  {selectedCustomer.createdAt
                    ? new Date(selectedCustomer.createdAt).toLocaleDateString()
                    : "Not Available"}
                </p>

                <p><strong>Orders:</strong> {selectedCustomer.totalOrders || 0}</p>
                <p><strong>Spent:</strong> ₹{selectedCustomer.totalSpent || 0}</p>
              </div>
            </div>
          </div>
        )}





        {activePage === "Laundrymen" && (
          <div className="admin-laundrymen-page">
            <div className="page-header">
              <h2>Dhobi Management</h2>
              <div className="header-actions">
                <input
                  type="text"
                  placeholder="Search Dhobi..."
                  value={laundrymanSearchTerm}
                  onChange={(e) => setLaundrymanSearchTerm(e.target.value)}
                  className="search-input"
                />
                {/* <button className="add-btn" onClick={() => setShowAddLaundrymanModal(true)}>
          + Add Laundryman
        </button> */}
              </div>
            </div>

            <div className="laundrymen-grid">
              {filteredLaundrymen.map((laundryman) => (
                <div key={laundryman.id} className="laundryman-card">
                  <div className="laundryman-header">
                    <img
                      src="/washer.webp"
                      alt="Dhobi avatar"
                      className="customer-image w-16 h-16 rounded-full object-cover"
                    />
                    <div className="laundryman-info">
                      <h4>{laundryman.name}</h4>
                      <p>{laundryman.email}</p>
                      <div className="rating"></div>
                      <span className={`status-badge ${laundryman.status.toLowerCase()}`}>
                        {laundryman.status}
                      </span>
                      <span className={`availability-badge ${laundryman.availability.toLowerCase()}`}>
                        {laundryman.availability}
                      </span>
                    </div>
                  </div>

                  <div className="laundryman-stats">
                    <div className="stat">
                      <span className="stat-label">Total Orders</span>
                      <span className="stat-value">{laundryman.totalOrders}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Completed</span>
                      <span className="stat-value">{laundryman.completedOrders}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Earnings</span>
                      <span className="stat-value">₹{laundryman.earnings}</span>
                    </div>
                  </div>

{/*                   <div className="specialties">
                    {laundryman.specialties.map((specialty, index) => (
                      <span key={index} className="specialty-tag">
                        {specialty}
                      </span>
                    ))}
                  </div> */}

{/*                   <div className="working-hours">
                    <h5>Working Hours:</h5>
                    <div className="hours-list">
                      {laundryman.workingHours.map((hour, index) => (
                        <span key={index} className="hour-tag">
                          {hour}
                        </span>
                      ))}
                    </div> 
                  </div>*/}



                  <div className="laundryman-actions">
                    <button
                      className="dashboard-btn"
                      onClick={() => handleViewUserDashboard(laundryman, "laundryman")}
                    >
                      Dashboard
                    </button>

                    <button
                      className={laundryman.status === "Active" ? "deactivate-btn" : "activate-btn"}
                      onClick={() =>
                        handleUserAction(
                          laundryman.id,
                          laundryman.status === "Active" ? "deactivate" : "activate",
                          "laundryman"
                        )
                      }
                    >
                      {laundryman.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === "Orders" && (
          <div className="admin-orders-page">
            <div className="page-header">
              <h2>Order Management</h2>
              <div className="order-filters">
                <select className="filter-select" value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)}>
                  <option>All Orders</option>
                  <option>Pending</option>
                  <option>Assigned</option>
                  <option>In Progress</option>
                  <option>Delivered</option>
                </select>
                <input
                  type="date"
                  className="date-filter"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                <button
                  className="clear-filter-btn"
                  onClick={() => {
                    setOrderFilter("All Orders")
                    setDateFilter("")
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Dhobi</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Time Slot</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>
                        {order.laundrymanName}
                        {!order.laundrymanId && (
                          <button
                            className="assign-btn small"
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowAssignOrderModal(true)
                            }}
                          >
                            Assign
                          </button>
                        )}
                      </td>
                      <td>{order.items.join(", ")}</td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase().replace(" ", "-")}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.timeSlot}</td>
                      <td>
                        <span className={`priority-badge ${order.priority.toLowerCase()}`}>{order.priority}</span>
                      </td>
                      <td>
                        <button className="view-btn small" onClick={() => handleViewOrder(order)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activePage === "TimeSlots" && (
          <div className="admin-timeslots-page">
            <div className="page-header">
              <h2>Time Slots Management</h2>
              <p className="page-description">Manage time slots and schedules for laundry services</p>
            </div>
            <SlotTemplateManagerComponent />
          </div>
        )}

        {activePage === "Messages" && (
          <div className="admin-messages-page">
            <div className="page-header">
              <h2>Contact Messages</h2>
              <p className="page-description">View and manage customer contact form submissions</p>
            </div>
            <AdminMessagesComponent />
          </div>
        )}

        {activePage === "Analytics" && (
          <div className="admin-analytics-page">
            <div className="page-header">
              <h2>Analytics & Reports</h2>
              <div className="analytics-filters">
                <select
                  className="filter-select"
                  value={analyticsFilter}
                  onChange={(e) => setAnalyticsFilter(e.target.value)}
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>Last Year</option>
                </select>
                <button className="export-btn">Export Report</button>
              </div>
            </div>
            <div className="analytics-grid">
              <div className="analytics-card revenue-chart">
                <h3>Revenue Trends</h3>
                <div className="chart-placeholder">
                  <div className="chart-content">
                    <div className="chart-icon">📈</div>
                    <p>Revenue Chart</p>
                    <div className="chart-stats">
                      <div className="chart-stat">
                        <span>Today: ₹{dashboardStats.todayRevenue}</span>
                      </div>
                      <div className="chart-stat">
                        <span>This Month: ₹{dashboardStats.monthlyRevenue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="analytics-card order-stats">
                <h3>Order Statistics</h3>
                <div className="order-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Completed</span>
                    <span className="breakdown-value">{dashboardStats.completedOrders}</span>
                    <div className="breakdown-bar">
                      <div className="breakdown-fill completed" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">In Progress</span>
                    <span className="breakdown-value">1</span>
                    <div className="breakdown-bar">
                      <div className="breakdown-fill in-progress" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Pending</span>
                    <span className="breakdown-value">{dashboardStats.pendingOrders}</span>
                    <div className="breakdown-bar">
                      <div className="breakdown-fill pending" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="analytics-card top-performers">
                <h3>Top Performing Laundrymen</h3>
                <div className="performers-list">
                  {laundrymen
                    .filter((l) => l.status === "Active")
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3)
                    .map((laundryman, index) => (
                      <div key={laundryman.id} className="performer-item">
                        <div className="performer-rank">#{index + 1}</div>
                        <img
                          src={laundryman.image || "/placeholder.svg"}
                          alt={laundryman.name}
                          className="performer-image"
                        />
                        <div className="performer-info">
                          <h5>{laundryman.name}</h5>
                          <p>
                            {laundryman.rating} • {laundryman.completedOrders} orders
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="analytics-card customer-insights">
                <h3>Customer Insights</h3>
                <div className="insights-content">
                  <div className="insight-item">
                    <span className="insight-label">Average Order Value</span>
                    <span className="insight-value">
                      ₹{Math.round(dashboardStats.totalRevenue / dashboardStats.totalOrders)}
                    </span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Customer Retention</span>
                    <span className="insight-value">85%</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">New Customers</span>
                    <span className="insight-value">12 this month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === "Settings" && (
          <div className="admin-settings-page">
            <div className="page-header">
              <h2>System Settings</h2>
            </div>
            <div className="settings-grid">
              <div className="settings-card">
                <h3>Platform Settings</h3>
                <div className="setting-item">
                  <label>Service Commission (%)</label>
                  <input
                    type="number"
                    value={settings.commission}
                    min="0"
                    max="50"
                    onChange={(e) => handleSettingChange("commission", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Minimum Order Amount</label>
                  <input
                    type="number"
                    value={settings.minOrderAmount}
                    min="50"
                    onChange={(e) => handleSettingChange("minOrderAmount", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Maximum Service Radius (km)</label>
                  <input
                    type="number"
                    value={settings.maxServiceRadius}
                    min="5"
                    max="100"
                    onChange={(e) => handleSettingChange("maxServiceRadius", Number.parseInt(e.target.value))}
                  />
                </div>
                <button className="save-btn" onClick={() => alert("Platform settings saved!")}>
                  Save Changes
                </button>
              </div>

              <div className="settings-card">
                <h3>Notification Settings</h3>
                <div className="setting-item toggle">
                  <label>Email Notifications</label>
                  <div
                    className={`toggle-switch ${settings.emailNotifications ? "enabled" : "disabled"}`}
                    onClick={() => handleToggleSetting("emailNotifications")}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>
                <div className="setting-item toggle">
                  <label>SMS Notifications</label>
                  <div
                    className={`toggle-switch ${settings.smsNotifications ? "enabled" : "disabled"}`}
                    onClick={() => handleToggleSetting("smsNotifications")}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>
                <div className="setting-item toggle">
                  <label>Push Notifications</label>
                  <div
                    className={`toggle-switch ${settings.pushNotifications ? "enabled" : "disabled"}`}
                    onClick={() => handleToggleSetting("pushNotifications")}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>
                <button className="save-btn" onClick={() => alert("Notification settings saved!")}>
                  Save Changes
                </button>
              </div>

              <div className="settings-card">
                <h3>Service Areas</h3>
                <div className="service-areas-list">
                  {serviceAreas.map((area, index) => (
                    <div key={index} className="area-item">
                      <span>{area}</span>
                      <button className="remove-btn" onClick={() => handleRemoveServiceArea(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="add-area">
                  <input
                    type="text"
                    placeholder="Add new service area"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddServiceArea()}
                  />
                  <button className="add-btn" onClick={handleAddServiceArea}>
                    Add Area
                  </button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Backup & Security</h3>
                <div className="setting-item">
                  <label>Last Backup</label>
                  <span>2024-12-03 10:30 AM</span>
                  <button className="backup-btn" onClick={handleCreateBackup}>
                    Create Backup
                  </button>
                </div>
                <div className="setting-item">
                  <label>Two-Factor Authentication</label>
                  <button className="enable-btn" onClick={handleEnable2FA}>
                    Enable 2FA
                  </button>
                </div>
                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    min="15"
                    max="120"
                    onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
                  />
                </div>
                <button className="save-btn" onClick={() => alert("Security settings saved!")}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>






      {/* Assign Order Modal */}
      {showAssignOrderModal && selectedOrder && (
        <div className="order-modal">
          <div className="modal-header">
            <span className="order-id">#{selectedOrder.id}</span>
            <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>
              {selectedOrder.status}
            </span>
            <span className="total-amount">₹{selectedOrder.totalAmount}</span>
          </div>
          <div className="modal-content">
            <div className="order-details">
              <div className="order-info-grid">
                <div className="info-item">
                  <label>Customer</label>
                  <span>{selectedOrder.customerName}</span>
                </div>
                <div className="info-item">
                  <label>Dhobi</label>
                  <span>{selectedOrder.laundrymanName || "Not Assigned"}</span>
                </div>
                <div className="info-item">
                  <label>Order Date</label>
                  <span>{selectedOrder.orderDate}</span>
                </div>
                {/* <div className="info-item">
                  <label>pick Date</label>
                  <span>{selectedOrder.date || "Not Set"}</span>
                </div>
                <div className="info-item">
                  <label>Time Slot</label>
                  <span>{selectedOrder.timeSlot || "Not Set"}</span>
                </div> */}


                <div className="info-item">
                  <label>Pickup Date</label>
                  <span>{selectedOrder.pickupDate || "Not Set"}</span>
                </div>

                <div className="info-item">
                  <label>Time Slot</label>
                  <span>
                    {selectedOrder.timeSlotLabel
                      ? `${selectedOrder.timeSlotLabel} (${selectedOrder.timeSlot})`
                      : selectedOrder.timeSlot || "Not Set"}
                  </span>
                </div>


                <div className="info-item">
                  <label>Payment Method</label>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                <div className="info-item">
                  <label>Payment Status</label>
                  <span className={`status-badge ${selectedOrder.paymentStatus.toLowerCase()}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div className="info-item">
                  <label>Current Status</label>
                  <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
              <div className="order-items">
                <h4>Order Items</h4>
                <ul>
                  {selectedOrder.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity} x {item.product.title} ({item.product.category})
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* User Dashboard Modal */}
      {showUserDashboardModal && selectedUserDashboard && (
        <div className="modal-overlay" onClick={() => setShowUserDashboardModal(false)}>
          <div className="user-dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedUserDashboard.name} - Dashboard</h3>
              <button className="close-btn" onClick={() => setShowUserDashboardModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="dashboard-overview">
                <div className="user-profile-section">
                  {/* <img
                    src={selectedUserDashboard.image || "/placeholder.svg"}
                    alt={selectedUserDashboard.name}
                    className="dashboard-user-image"
                  /> */}
                  <div className="user-basic-info">
                    <h4>{selectedUserDashboard.name}</h4>
                    <p>{selectedUserDashboard.email}</p>
                    <span className={`status-badge ${selectedUserDashboard.status.toLowerCase()}`}>
                      {selectedUserDashboard.status}
                    </span>
                  </div>
                </div>

                {selectedUserDashboard.userType === "customer" ? (
                  <div className="customer-dashboard">
                    <div className="dashboard-stats-grid">
                      <div className="dashboard-stat">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                          <h5>Total Orders</h5>
                          <span>{selectedUserDashboard.totalOrders}</span>
                        </div>
                      </div>
                      <div className="dashboard-stat">
                        <div className="stat-icon">₹</div>
                        <div className="stat-info">
                          <h5>Total Spent</h5>
                          <span>₹{selectedUserDashboard.totalSpent}</span>
                        </div>
                      </div>
                      <div className="dashboard-stat">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-info">
                          <h5>Loyalty Points</h5>
                          <span>{selectedUserDashboard.loyaltyPoints}</span>
                        </div>
                      </div>
                    </div>

                    <div className="customer-orders">
                      <h5>Recent Orders</h5>
                      <div className="orders-list">
                        {orders
                          .filter((order) => order.customerId === selectedUserDashboard.id)
                          .slice(0, 5)
                          .map((order) => (
                            <div key={order.id} className="order-item">
                              <div className="order-info">
                                <span className="order-id">{order.id}</span>
                                <span className="order-date">{order.orderDate}</span>
                              </div>
                              <div className="order-details">
                                <span className="order-amount">₹{order.totalAmount}</span>
                                <span className={`status-badge ${order.status.toLowerCase().replace(" ", "-")}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="customer-preferences">
                      <h5>Preferences</h5>
                      <div className="preferences-list">
                        {selectedUserDashboard.preferences.map((pref, index) => (
                          <span key={index} className="preference-tag">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="laundryman-dashboard">
                    <div className="laundryman-info-card">
                      <h4>Dhobi Details</h4>
                      <div className="info-row"><strong>Name:</strong> {selectedUserDashboard.name}</div>
                      <div className="info-row"><strong>Email:</strong> {selectedUserDashboard.email}</div>
                      <div className="info-row"><strong>Contact:</strong> {selectedUserDashboard.contact}</div>
                      <div className="info-row"><strong>Joined On:</strong> {new Date(selectedUserDashboard.createdAt).toLocaleDateString()}</div>

                    </div>
                    <div className="dashboard-stats-grid">
                      <div className="dashboard-stat">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                          <h5>total Order</h5>
                          <span>{selectedUserDashboard.totalOrders}</span>
                        </div>
                      </div>
                      {/* <div className="dashboard-stat">
                        <div className="stat-icon"></div>
                        <div className="stat-info">
                          <h5>Rating</h5>
                          <span>{selectedUserDashboard.rating}</span>
                        </div>
                      </div> */}
                      <div className="dashboard-stat">
                        <div className="stat-icon">₹</div>
                        <div className="stat-info">
                          <h5>Earnings</h5>
                          <span>₹{selectedUserDashboard.earnings}</span>
                        </div>
                      </div>
                      <div className="dashboard-stat">
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                          <h5>Complete order</h5>
                          <span>
                            {selectedUserDashboard.completedOrders}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="laundryman-orders">
                      <h5>Assigned Orders</h5>
                      <div className="orders-list">
                        {orders
                          .filter((order) => order.laundrymanId === selectedUserDashboard.id)
                          .slice(0, 5)
                          .map((order) => (
                            <div key={order.id} className="order-item">
                              <div className="order-info">
                                <span className="order-id">{order.id}</span>
                                <span className="customer-name">{order.customerName}</span>
                              </div>
                              <div className="order-details">
                                <span className="order-amount">₹{order.totalAmount}</span>
                                <span className={`status-badge ${order.status.toLowerCase().replace(" ", "-")}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
{/*                     <div className="laundryman-schedule">
                      <h5>Working Hours</h5>
                      <div className="schedule-list">
                        {Array.isArray(selectedUserDashboard.workingHours) &&
                          selectedUserDashboard.workingHours.length > 0 ? (
                          selectedUserDashboard.workingHours.map((hour, index) => (
                            <span key={index} className="hour-tag">
                              {hour}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No working hours available</span>
                        )}
                      </div>
                    </div>
 */}

{/*                     <div className="laundryman-specialties">
                      <h5>Specialties</h5>
                      <div className="specialties-list">
                        {selectedUserDashboard.specialties.map((specialty, index) => (
                          <span key={index} className="specialty-tag">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Time Slot Modal */}
      {showTimeSlotModal && (
        <div className="modal-overlay" onClick={() => setShowTimeSlotModal(false)}>
          <div className="timeslot-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Time Slot</h3>
              <button className="close-btn" onClick={() => setShowTimeSlotModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const newSlot = {
                    label: formData.get("label"),
                    range: formData.get("range"),
                  };
                  handleAddTimeSlot(newSlot);
                  setShowTimeSlotModal(false);
                }}
              >
                <div className="form-group">
                  <label>Label</label>
                  <input name="label" type="text" required placeholder="e.g., Morning" />
                </div>
                <div className="form-group">
                  <label>Time Range</label>
                  <input
                    name="range"
                    type="text"
                    required
                    placeholder="e.g., 07:00-09:00"
                    pattern="[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}"
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-btn">Add Slot</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowTimeSlotModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Time Slot Modal */}
      {showEditTimeSlotModal && selectedTimeSlot && (
        <div className="modal-overlay" onClick={() => setShowEditTimeSlotModal(false)}>
          <div className="timeslot-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Time Slot</h3>
              <button className="close-btn" onClick={() => setShowEditTimeSlotModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleSaveTimeSlotEdit}>
                <div className="form-group">
                  <label>Time Slot</label>
                  <input
                    name="slot"
                    type="text"
                    required
                    defaultValue={selectedTimeSlot.slot}
                    placeholder="e.g., 09:00-12:00"
                    pattern="[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}"
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Orders</label>
                  <input
                    name="maxOrders"
                    type="number"
                    required
                    min="1"
                    max="50"
                    defaultValue={selectedTimeSlot.maxOrders}
                    placeholder="Enter maximum orders for this slot"
                  />
                </div>
                <div className="form-group">
                  <label>Current Orders</label>
                  <input
                    type="number"
                    value={selectedTimeSlot.currentOrders}
                    disabled
                    className="disabled-input"
                  />
                  <small className="form-help">Current orders cannot be modified directly</small>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setShowEditTimeSlotModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedUser.userType === "customer" ? "Customer" : "Laundryman"} Details</h3>
              <button className="close-btn" onClick={() => setShowUserModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="user-details">
                <img
                  src={selectedUser.image || "/placeholder.svg"}
                  alt={selectedUser.name}
                  className="user-detail-image"
                />
                <div className="user-info-grid">
                  <div className="info-item">
                    <label>Name</label>
                    <span>{selectedUser.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <span>{selectedUser.phone}</span>
                  </div>
                  <div className="info-item">
                    <label>Address</label>
                    <span>{selectedUser.address}</span>
                  </div>
                  <div className="info-item">
                    <label>Join Date</label>
                    <span>{selectedUser.joinDate}</span>
                  </div>
                  <div className="info-item">
                    <label>Status</label>
                    <span className={`status-badge ${selectedUser.status.toLowerCase()}`}>{selectedUser.status}</span>
                  </div>

                  {selectedUser.userType === "customer" && (
                    <>
                      <div className="info-item">
                        <label>Total Orders</label>
                        <span>{selectedUser.totalOrders}</span>
                      </div>
                      <div className="info-item">
                        <label>Total Spent</label>
                        <span>₹{selectedUser.totalSpent}</span>
                      </div>
                      <div className="info-item">
                        <label>Preferences</label>
                        <div className="preferences-list">
                          {selectedUser.preferences.map((pref, index) => (
                            <span key={index} className="preference-tag">
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedUser.userType === "laundryman" && (
                    <>
                      <div className="info-item">
                        <label>Rating</label>
                        <span> {selectedUser.rating}</span>
                      </div>
                      <div className="info-item">
                        <label>Completed Orders</label>
                        <span>{selectedUser.completedOrders}</span>
                      </div>
                      <div className="info-item">
                        <label>Current Orders</label>
                        <span>
                          {selectedUser.currentOrders}/{selectedUser.maxOrders}
                        </span>
                      </div>
                      <div className="info-item">
                        <label>Earnings</label>
                        <span>₹{selectedUser.earnings}</span>
                      </div>
                      <div className="info-item">
                        <label>Availability</label>
                        <span className={`availability-badge ${selectedUser.availability.toLowerCase()}`}>
                          {selectedUser.availability}
                        </span>
                      </div>
                      <div className="info-item">
                        <label>Working Hours</label>
                        <div className="hours-list">
                          {selectedUser.workingHours.map((hour, index) => (
                            <span key={index} className="hour-tag">
                              {hour}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="info-item">
                        <label>Specialties</label>
                        <div className="specialties-list">
                          {selectedUser.specialties.map((specialty, index) => (
                            <span key={index} className="specialty-tag">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - {selectedOrder.id}</h3>
              <button className="close-btn" onClick={() => setShowOrderModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="order-details">
                <div className="order-info-grid">
                  <div className="info-item">
                    <label>Customer</label>
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <div className="info-item">
                    <label>Dhobi</label>
                    <span>{selectedOrder.laundrymanName}</span>
                  </div>
                  <div className="info-item">
                    <label>Order Date</label>
                    <span>{selectedOrder.orderDate}</span>
                  </div>
                  <div className="info-item">
                    <label>Pickup Date</label>
                    <span>{selectedOrder.pickupDate || "Not Set"}</span>
                  </div>

                  <div className="info-item">
                    <label>Time Slot</label>
                    <span>
                      {selectedOrder.timeSlotLabel
                        ? `${selectedOrder.timeSlotLabel} (${selectedOrder.timeSlot})`
                        : selectedOrder.timeSlot || "Not Set"}
                    </span>
                  </div>

                  <div className="info-item">
                    <label>Priority</label>
                    <span className={`priority-badge ${selectedOrder.priority.toLowerCase()}`}>
                      {selectedOrder.priority}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Total Amount</label>
                    <span>₹{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="info-item">
                    <label>Payment Method</label>
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="info-item">
                    <label>Payment Status</label>
                    <span className={`status-badge ${selectedOrder.paymentStatus.toLowerCase()}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Order Status</label>
                    <span className={`status-badge ${selectedOrder.status.toLowerCase().replace(" ", "-")}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items</h4>
                  <ul>
                    {selectedOrder.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="logout-popup-overlay">
          <div className="logout-popup-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-popup-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="cancel-btn" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



export default AdminDashboard
