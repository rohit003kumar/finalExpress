

// import React, { useState } from 'react';
// import { Camera, Plus, ArrowLeft, Tag, Shirt } from 'lucide-react';
// import { Service } from './Types/Servicee';
// import { apiFetch } from '../utilss/apifetch';

// interface ServiceFormProps {
//   onSubmit: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
//   onBack: () => void;
// }

// const categories = [
//   { value: 'Shirt', label: 'Shirt', icon: '👔' },
//   { value: 'Pant', label: 'Pant', icon: '👖' },
//   { value: 'Bedsheet', label: 'Bedsheet', icon: '🛏️' },
//   { value: 'Curtain', label: 'Curtain', icon: '🪟' },
// ];

// const serviceTypes = [
//   { value: 'wash', label: 'wash', icon: '🧼' },
//   { value: 'dry-clean', label: 'dry-clean', icon: '🧽' },
//   { value: 'iron', label: 'iron', icon: '🔥' },
// ];

// export default function ServiceForm({ onSubmit, onBack }: ServiceFormProps) {
//   const [formData, setFormData] = useState({
//     title: '',
//     name: '',
//     category: '',
//     serviceType: '',
//     price: '',
//     description: '',
//   });

//   const [photo, setPhoto] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setPhoto(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       !formData.title.trim() ||
//       // !formData.name.trim() ||
//       !formData.category ||
//       !formData.serviceType ||
//       !formData.price ||
//       // !formData.description.trim() ||
//       !photo
//     )
//       return alert('Please fill all required fields and upload a photo.');

//     try {
//       setIsSubmitting(true);

//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('User not logged in. Token missing.');
//       }

//       const data = new FormData();
//       Object.entries(formData).forEach(([key, value]) => data.append(key, value));
//       data.append('image', photo);

//       const res = await apiFetch('/api/product/create', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: data,
//       });

//       if (!res.ok) {
//         let msg = 'Upload failed';
//         try {
//           const error = await res.json();
//           msg = error.message || msg;
//         } catch {
//           const fallback = await res.text();
//           msg = fallback || msg;
//         }
//         throw new Error(msg);
//       }

// alert('Service created successfully!');
// setFormData({
//   title: '',
//   name: '',
//   category: '',
//   serviceType: '',
//   price: '',
//   description: '',
// });
// setPhoto(null);
// setPreview(null);

// const result = await res.json();
// onSubmit({
//   _id: result._id,
//   title: formData.title,
//   name: formData.name,
//   category: formData.category,
//   serviceType: formData.serviceType,
//   price: parseFloat(formData.price),
//   description: formData.description,
//   image: result.imageUrl,
// });

//     } catch (err: any) {
//       console.error('Upload error:', err);
//       alert(err.message || 'Upload failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const isFormValid =
//     formData.title.trim() &&
//     // formData.name.trim() &&
//     formData.category &&
//     formData.serviceType &&
//     formData.price &&
//     // formData.description.trim() &&
//     photo;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-3xl mx-auto">
//           <div className="flex items-center gap-4 mb-8">
//             <button
//               onClick={onBack}
//               className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
//             >
//               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
//               Back to Services
//             </button>
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-8 py-6">
//               <h1 className="text-2xl font-bold text-white flex items-center gap-3">
//                 <Plus className="w-6 h-6" />
//                 Add New Service
//               </h1>
//               <p className="text-blue-100 mt-2">Fill in the details to add a new washing service</p>
//             </div>

//             <form onSubmit={handleSubmit} className="p-8 space-y-6">
//               {/* Title */}
//               <div className="space-y-2">
//                 <label htmlFor="title" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                   <Tag className="w-4 h-4" />
//                   Service Title *
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   value={formData.title}
//                   onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
//                   placeholder="e.g., Premium Shirt Washing Service"
//                   required
//                 />
//               </div>

//               {/* Name */}
//               <div className="space-y-2">
//                 <label htmlFor="name" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                   <Shirt className="w-4 h-4" />
//                   Service Name *
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   value={formData.name}
//                   onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
//                   placeholder="e.g., Express Wash & Fold"
                 
//                 />
//               </div>

//               {/* Category and Service Type */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category *</label>
//                   <select
//                     id="category"
//                     value={formData.category}
//                     onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((category) => (
//                       <option key={category.value} value={category.value}>
//                         {category.icon} {category.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-700">Service Type *</label>
//                   <select
//                     id="serviceType"
//                     value={formData.serviceType}
//                     onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl"
//                     required
//                   >
//                     <option value="">Select Service Type</option>
//                     {serviceTypes.map((type) => (
//                       <option key={type.value} value={type.value}>
//                         {type.icon} {type.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Price */}
//               <div className="space-y-2">
//                 <label htmlFor="price" className="block text-sm font-semibold text-gray-700">Price (₹) *</label>
//                <input
//                type="number"
//                id="price"
//                value={formData.price}
//                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
//                onWheel={(e) => e.currentTarget.blur()}
//                onKeyDown={(e) => {
//              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
//                  e.preventDefault();
//                 }
//           }}
//                  className="w-full px-4 py-3 border border-gray-300 rounded-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                  placeholder="Amount"
//                  required
//                 />
//               </div>

//               {/* Photo Upload */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                   <Camera className="w-4 h-4" /> Service Photo *
//                 </label>
//                 <div className="relative">
//                   <input type="file" id="photo" accept="image/*" onChange={handlePhotoChange} className="hidden" />
//                   <label
//                     htmlFor="photo"
//                     className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors duration-200 bg-gray-50 hover:bg-blue-50"
//                   >
//                     {preview ? (
//                       <div className="relative w-full h-full">
//                         <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
//                         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200">
//                           <Camera className="w-8 h-8 text-white" />
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-8">
//                         <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-600 font-medium">Click to upload a photo</p>
//                         <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 10MB</p>
//                       </div>
//                     )}
//                   </label>
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="space-y-2">
//                 <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Service Description *</label>
//                 <textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                   rows={4}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl"
//                   placeholder="Describe your service in detail..."
                
//                 />
//               </div>

//               {/* Submit Button */}
//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting || !isFormValid}
//                   className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-teal-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
//                 >
//                   {isSubmitting ? (
//                     <div className="flex items-center justify-center gap-3">
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Adding Service...
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center gap-3">
//                       <Plus className="w-5 h-5" />
//                       Add Service
//                     </div>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
















// import React, { useState } from 'react';
// import { Camera, Plus, ArrowLeft, Tag, Shirt } from 'lucide-react';
// import { Service } from './Types/Servicee';
// import { apiFetch } from '../utilss/apifetch';

// interface ServiceFormProps {
//   onSubmit: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
//   onBack: () => void;
// }

// const categories = [
//   { value: 'Shirt', label: 'Shirt', icon: '👔' },
//   { value: 'Pant', label: 'Pant', icon: '👖' },
//   { value: 'Bedsheet', label: 'Bedsheet', icon: '🛏️' },
//   { value: 'Curtain', label: 'Curtain', icon: '🪟' },
// ];

// const serviceTypes = [
//   { value: 'wash', label: 'wash', icon: '🧼' },
//   { value: 'dry-clean', label: 'dry-clean', icon: '🧽' },
//   { value: 'iron', label: 'iron', icon: '🔥' },
// ];

// export default function ServiceForm({ onSubmit, onBack }: ServiceFormProps) {
//   const [formData, setFormData] = useState({
//     title: '',
//     name: '',
//     category: '',
//     description: '',
//     serviceTypesSelected: [] as { type: string; price: string }[],
//   });

//   const [photo, setPhoto] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setPhoto(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       !formData.title.trim() ||
//       !formData.category ||
//       formData.serviceTypesSelected.length === 0 ||
//       formData.serviceTypesSelected.some(t => !t.price) ||
//       !photo
//     ) {
//       return alert('Please fill all required fields, select at least one service type, and upload a photo.');
//     }

//     try {
//       setIsSubmitting(true);

//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('User not logged in.');

//       const data = new FormData();
//       data.append('title', formData.title);
//       data.append('name', formData.name);
//       data.append('category', formData.category);
//       data.append('description', formData.description);
//       data.append('serviceTypes', JSON.stringify(formData.serviceTypesSelected));
//       data.append('image', photo);

//       const res = await apiFetch('/api/product/create', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: data,
//       });

//       if (!res.ok) {
//         const error = await res.json().catch(() => ({}));
//         throw new Error(error.message || 'Upload failed');
//       }

//       const result = await res.json();
//       alert('Service created successfully!');
//       setFormData({
//         title: '',
//         name: '',
//         category: '',
//         description: '',
//         serviceTypesSelected: [],
//       });
//       setPhoto(null);
//       setPreview(null);

//       onSubmit({
//         _id: result._id,
//         title: formData.title,
//         name: formData.name,
//         category: formData.category,
//         price: 0, // backend should calculate price per type
//         description: formData.description,
//         image: result.imageUrl,
//         serviceType: '', // unused now; serviceTypes is sent instead
//       });

//     } catch (err: any) {
//       alert(err.message || 'Upload failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const isFormValid =
//     formData.title.trim() &&
//     formData.category &&
//     formData.serviceTypesSelected.length > 0 &&
//     formData.serviceTypesSelected.every(t => t.price) &&
//     photo;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-3xl mx-auto">
//           <div className="flex items-center gap-4 mb-8">
//             <button
//               onClick={onBack}
//               className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
//             >
//               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
//               Back to Services
//             </button>
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-8 py-6">
//               <h1 className="text-2xl font-bold text-white flex items-center gap-3">
//                 <Plus className="w-6 h-6" />
//                 Add New Service
//               </h1>
//               <p className="text-blue-100 mt-2">Fill in the details to add a new washing service</p>
//             </div>

//             <form onSubmit={handleSubmit} className="p-8 space-y-6">
//               {/* Title */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                   <Tag className="w-4 h-4" />
//                   Service Title *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.title}
//                   onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg"
//                   placeholder="e.g., Premium Shirt Washing Service"
//                   required
//                 />
//               </div>

//               {/* Name */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                   <Shirt className="w-4 h-4" />
//                   Service Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg"
//                   placeholder="e.g., Express Wash & Fold"
//                 />
//               </div>

//               {/* Category */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">Category *</label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl"
//                   required
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((c) => (
//                     <option key={c.value} value={c.value}>
//                       {c.icon} {c.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Multiple Service Types with Prices */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">Service Types & Prices *</label>
//                 <div className="space-y-4">
//                   {serviceTypes.map((type) => {
//                     const entry = formData.serviceTypesSelected.find((t) => t.type === type.value);
//                     return (
//                       <div key={type.value} className="flex items-center gap-4">
//                         <input
//                           type="checkbox"
//                           checked={!!entry}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setFormData(prev => ({
//                                 ...prev,
//                                 serviceTypesSelected: [...prev.serviceTypesSelected, { type: type.value, price: '' }],
//                               }));
//                             } else {
//                               setFormData(prev => ({
//                                 ...prev,
//                                 serviceTypesSelected: prev.serviceTypesSelected.filter(t => t.type !== type.value),
//                               }));
//                             }
//                           }}
//                         />
//                         <label className="flex-1 flex items-center gap-2">
//                           <span>{type.icon}</span> {type.label}
//                         </label>
//                         {entry && (
//                           <input
//                             type="number"
//                             placeholder="₹ Price"
//                             value={entry.price}
//                             onChange={(e) => {
//                               setFormData(prev => ({
//                                 ...prev,
//                                 serviceTypesSelected: prev.serviceTypesSelected.map(t =>
//                                   t.type === type.value ? { ...t, price: e.target.value } : t
//                                 ),
//                               }));
//                             }}
//                             className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
//                             required
//                           />
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Photo Upload */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                   <Camera className="w-4 h-4" />
//                   Service Photo *
//                 </label>
//                 <div className="relative">
//                   <input type="file" id="photo" accept="image/*" onChange={handlePhotoChange} className="hidden" />
//                   <label
//                     htmlFor="photo"
//                     className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 bg-gray-50 hover:bg-blue-50"
//                   >
//                     {preview ? (
//                       <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
//                     ) : (
//                       <div className="text-center py-8">
//                         <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-600 font-medium">Click to upload a photo</p>
//                         <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 10MB</p>
//                       </div>
//                     )}
//                   </label>
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">Service Description *</label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                   rows={4}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl"
//                   placeholder="Describe your service in detail..."
//                 />
//               </div>

//               {/* Submit Button */}
//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting || !isFormValid}
//                   className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-teal-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
//                 >
//                   {isSubmitting ? (
//                     <div className="flex items-center justify-center gap-3">
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Adding Service...
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center gap-3">
//                       <Plus className="w-5 h-5" />
//                       Add Service
//                     </div>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
















import React, { useState } from 'react';
import { Camera, Plus, ArrowLeft } from 'lucide-react';
import { apiFetch } from '../utilss/apifetch';

const SERVICE_OPTIONS = [
  { id: 'wash', name: 'Wash', icon: '🧼' },
  { id: 'dry-clean', name: 'Dry-Clean', icon: '🧴' },
  { id: 'iron', name: 'Iron', icon: '🔥' },
];

interface ServiceFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

interface SelectedOption {
  id: string;
  name: string;
  price: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    category: '',
    description: '',
    options: [] as SelectedOption[],
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const toggleOption = (id: string, name: string) => {
    const exists = formData.options.find(opt => opt.id === id);
    let updated = [];

    if (exists) {
      updated = formData.options.filter(opt => opt.id !== id);
    } else {
      updated = [...formData.options, { id, name, price: '' }];
    }

    setFormData(prev => ({ ...prev, options: updated }));
  };

  const updatePrice = (id: string, value: string) => {
    const updated = formData.options.map(opt =>
      opt.id === id ? { ...opt, price: value } : opt
    );
    setFormData(prev => ({ ...prev, options: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invalid =
      !formData.title.trim() ||
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.description.trim() ||
      formData.options.length === 0 ||
      formData.options.some(o => !o.price || isNaN(Number(o.price))) ||
      !photo;

    if (invalid) {
      alert('Please fill all fields, set valid prices, and upload a photo.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not logged in.');

      const formattedOptions = formData.options.map(o => ({
        id: o.id,
        name: o.name,
        price: Number(o.price),
      }));

      const form = new FormData();
      form.append('title', formData.title);
      form.append('name', formData.name);
      form.append('category', formData.category);
      form.append('description', formData.description);
      form.append('options', JSON.stringify(formattedOptions)); // IMPORTANT: stringify array
      form.append('image', photo);

      const res = await apiFetch('/api/product/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create service.');
      }

      const result = await res.json();
      alert('Service created successfully!');
      setFormData({
        title: '',
        name: '',
        category: '',
        description: '',
        options: [],
      });
      setPhoto(null);
      setPreview(null);
      onSubmit(result);
    } catch (err: any) {
      alert(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <button onClick={onBack} className="mb-4 text-sm text-blue-600 flex items-center">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <h2 className="text-xl font-bold text-blue-600 mb-1 flex items-center gap-2">
        <Plus /> Add New Service
      </h2>
      <p className="text-gray-500 mb-4">Fill in the details to add a new washing service</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Service Title *</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Premium Shirt Washing Service"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Service Name *</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Express Wash & Fold"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Category *</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Shirt">Shirt</option>
              <option value="Pant">Pant</option>
              <option value="Bedsheet">Bedsheet</option>
              <option value="Curtain">Curtain</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium">Service Options *</label>
            <div className="space-y-2">
              {SERVICE_OPTIONS.map(({ id, name, icon }) => {
                const selected = formData.options.find(o => o.id === id);
                return (
                  <div key={id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => toggleOption(id, name)}
                    />
                    <span>{icon}</span>
                    <span className="capitalize">{name}</span>
                    {selected && (
                      <input
                        type="number"
                        min="0"
                        value={selected.price}
                        onChange={e => updatePrice(id, e.target.value)}
                        placeholder="₹ Price"
                        className="ml-2 border px-2 py-1 w-24 rounded"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Service Photo *</label>
          <div className="border border-dashed p-4 rounded text-center cursor-pointer">
            <label className="cursor-pointer">
              {preview ? (
                <img src={preview} alt="Preview" className="h-32 mx-auto object-cover" />
              ) : (
                <div>
                  <Camera className="mx-auto mb-2" />
                  <span>Click to upload a photo</span>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Service Description *</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={3}
            placeholder="Describe your service in detail..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-500 to-teal-400 text-white py-2 px-6 rounded w-full font-semibold"
        >
          {isSubmitting ? 'Adding Service...' : '+ Add Service'}
        </button>
      </form>
    </div>
  );
};

export default ServiceForm;
