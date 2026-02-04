import React, { useState, useEffect, useRef, useCallback } from "react";
import { Camera, Upload, Edit2, Trash2, Star, UserPlus, Check, X, Loader2, RefreshCw, AlertTriangle, Moon, Sun } from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";

const AddEmployee = () => {
  const [form, setForm] = useState({ emp_id: "", name: "", email: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Webcam states
  const webcamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lightingStatus, setLightingStatus] = useState("unknown"); // unknown, good, bad
  const [brightnessLevel, setBrightnessLevel] = useState(0);

  const getCompanyToken = () =>
    localStorage.getItem("company_token") ||
    localStorage.getItem("face_verification_company_token");

  // Edit employee
  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setForm({
      emp_id: employee.employee_id,
      name: employee.name,
      email: employee.email
    });
    setPreview(null);
    setFile(null);
    setIsCapturing(false);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.emp_id) {
      alert("Name and Employee ID are required");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("emp_id", form.emp_id);
    formData.append("name", form.name);
    formData.append("email", form.email || "");

    setLoading(true);

    try {
      const token = getCompanyToken();

      if (editingId) {
        // Update employee
        await axios.put(`/api/employee/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        });
        setEditingId(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // Add employee
        await axios.post("/api/employee/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        });
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }

      // Refresh list and reset form
      fetchEmployees();
      setForm({ emp_id: "", name: "", email: "" });
      setFile(null);
      setPreview(null);
      setIsCapturing(false);
    } catch (err) {
      console.error("Error saving employee:", err);
      const msg = err.response?.data?.detail || "Failed to save employee. Please try again.";
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    try {
      const token = getCompanyToken();
      await axios.delete(`/api/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(employees.filter(emp => emp.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete employee:", err);
      alert("Failed to delete employee");
    }
  };

  const confirmDelete = (id, name) => {
    setShowDeleteConfirm({ id, name });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Webcam Logic
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
      
      // Convert base64 to blob for upload
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
          setFile(file);
        });
      
      setIsCapturing(false);
    }
  }, [webcamRef]);

  // Lighting Check Logic
  const checkLighting = useCallback(() => {
    if (webcamRef.current && isCapturing) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r, g, b, avg;
        let colorSum = 0;

        for (let x = 0, len = data.length; x < len; x += 4) {
          r = data[x];
          g = data[x + 1];
          b = data[x + 2];
          avg = Math.floor((r + g + b) / 3);
          colorSum += avg;
        }

        const brightness = Math.floor(colorSum / (img.width * img.height));
        setBrightnessLevel(brightness);

        // Thresholds for lighting (0-255)
        // Below 80 is considered dark, above 200 is too bright
        if (brightness < 80) {
          setLightingStatus("bad");
        } else if (brightness > 200) {
           // Maybe too bright but usually acceptable, can add 'glare' warning if needed
           setLightingStatus("good");
        } else {
          setLightingStatus("good");
        }
      };
    }
  }, [isCapturing]);

  useEffect(() => {
    let interval;
    if (isCapturing) {
      interval = setInterval(checkLighting, 1000); // Check every second
    }
    return () => clearInterval(interval);
  }, [isCapturing, checkLighting]);

  const fetchEmployees = async () => {
    try {
      const token = getCompanyToken();
      const res = await axios.get("/api/company/emp_list", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const formatted = res.data.map((emp) => ({
        id: emp.id,
        employee_id: emp.employee_id,
        name: emp.name,
        email: emp.email,
        image_path: emp.image_path,
        point_total: emp.point_total,
        initials: emp.name
          .split(" ")
          .map(n => n[0])
          .join("")
          .toUpperCase(),
        color: "bg-orange-100 text-orange-600",
      }));
      setEmployees(formatted);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 font-sans">
      <div className="fixed w-full z-50">
        <Navbar />
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Employee Data</h3>
              <p className="text-gray-600 mb-4">
                Please wait while we process the image and update the database.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
                <p className="font-semibold mb-1">AI Processing Active</p>
                <p>Ensuring face data is securely encoded for recognition.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-24 right-4 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg z-50 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-green-800 font-medium">Success!</p>
                <p className="text-green-700 text-sm">
                  {editingId ? "Employee updated successfully" : "Employee added successfully"}
                </p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="text-green-600 hover:text-green-800 ml-auto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Employee</h3>
                  <p className="text-gray-600 mt-1">
                    Are you sure you want to delete <span className="font-semibold text-gray-900">{showDeleteConfirm.name}</span>?
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm.id)}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Employee
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-2">
            Employee Management
          </h1>
          <p className="text-gray-600 text-lg">Enroll and manage your team for secure face verification.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enrollment Form */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/50 p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <UserPlus className="w-5 h-5 text-orange-600" />
                </div>
                {editingId ? "Edit Employee" : "Enroll New Employee"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Capture Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Employee Photo <span className="text-red-500">*</span>
                  </label>

                  <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[4/3] shadow-inner mb-4 group">
                    {isCapturing ? (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          className="w-full h-full object-cover"
                          videoConstraints={{ facingMode: "user" }}
                        />
                        {/* Lighting Indicator */}
                        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-2 text-xs font-medium shadow-lg transition-all ${
                          lightingStatus === 'bad' 
                            ? "bg-red-500/80 border-red-400 text-white" 
                            : "bg-green-500/80 border-green-400 text-white"
                        }`}>
                          {lightingStatus === 'bad' ? (
                            <>
                              <Moon className="w-3 h-3" />
                              <span>Low Light</span>
                            </>
                          ) : (
                            <>
                              <Sun className="w-3 h-3" />
                              <span>Good Light</span>
                            </>
                          )}
                        </div>
                        
                        {lightingStatus === 'bad' && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                              Please increase lighting
                            </div>
                          </div>
                        )}
                      </>
                    ) : preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                        <Camera className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm font-medium">No photo captured</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {!isCapturing ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCapturing(true);
                          setPreview(null);
                          setFile(null);
                        }}
                        className="flex-1 py-2.5 px-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        {preview ? "Retake Photo" : "Start Camera"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={capture}
                        className="flex-1 py-2.5 px-4 bg-white text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center justify-center gap-2 shadow-sm active:scale-95"
                      >
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        Capture
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="emp_id"
                      value={form.emp_id}
                      onChange={handleChange}
                      placeholder="e.g., EMP001"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g., email@company.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!form.name || !form.emp_id || (!file && !editingId) || loading}
                  className={`w-full py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-bold transition-all transform active:scale-[0.98]
                    ${!form.name || !form.emp_id || (!file && !editingId) || loading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40"
                    }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {editingId ? <Check className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                      {editingId ? "Update Employee" : "Enroll Employee"}
                    </>
                  )}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ emp_id: "", name: "", email: "" });
                      setPreview(null);
                      setFile(null);
                    }}
                    className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Cancel Editing
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Employee List */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/50 p-6 sm:p-8 min-h-[600px]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Enrolled Team</h2>
                  <p className="text-gray-500 text-sm mt-1">{employees.length} employees registered</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={fetchEmployees}
                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                    title="Refresh List"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {employees.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <UserPlus className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No employees yet</h3>
                  <p className="text-gray-500 max-w-xs mx-auto">
                    Start by enrolling your first employee using the form on the left.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                        editingId === employee.id 
                          ? "bg-orange-50 border-orange-200 ring-1 ring-orange-500/20" 
                          : "bg-white border-gray-100 hover:border-orange-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0 bg-gray-100">
                            {employee.image_path ? (
                              <img
                                src={`/api/${employee.image_path}`}
                                alt={employee.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-full h-full ${employee.color} flex items-center justify-center text-lg font-bold ${employee.image_path ? 'hidden' : 'flex'}`}
                            >
                              {employee.initials}
                            </div>
                          </div>
                          {editingId === employee.id && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate pr-6">{employee.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-600">
                              {employee.employee_id}
                            </span>
                          </div>
                          {employee.email && (
                            <p className="text-xs text-gray-400 truncate mt-1">{employee.email}</p>
                          )}
                        </div>

                        <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(employee.id, employee.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
