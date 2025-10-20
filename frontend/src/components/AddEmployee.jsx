import React, { useState, useEffect } from "react";
import { Camera, Upload, Edit2, Trash2, Star, UserPlus, Check, X } from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar.jsx";

const AddEmployee = () => {
  const [form, setForm] = useState({ emp_id: "", name: "", email: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Edit employee
  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setForm({
      emp_id: employee.employee_id,
      name: employee.name,
      email: employee.email
    });
    setPreview(null);
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

    console.log("Submitting form data:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const token = localStorage.getItem("company_token");

      if (editingId) {
        // Update employee
        await axios.put(`http://localhost:8000/employee/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        });
        setEmployees(employees.map(emp =>
          emp.id === editingId
            ? { ...emp, name: form.name, email: form.email, employee_id: form.emp_id }
            : emp
        ));
        setEditingId(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // Add employee
        const res = await axios.post("http://localhost:8000/employee/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        });

        console.log("Employee created:", res.data);

        // Refresh employees list to get the new employee with all fields
        fetchEmployees();

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }

      // Reset form
      setForm({ emp_id: "", name: "", email: "" });
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Error saving employee:", err);
      console.error("Error response:", err.response?.data);

      if (err.response?.data?.detail) {
        alert(`Failed to save employee: ${err.response.data.detail}`);
      } else if (err.response?.status === 422) {
        // Handle validation errors
        const errors = err.response.data.detail;
        if (Array.isArray(errors)) {
          const errorMessages = errors.map(error =>
            `${error.loc[1]}: ${error.msg}`
          ).join('\n');
          alert(`Validation errors:\n${errorMessages}`);
        } else {
          alert("Validation error. Please check all required fields.");
        }
      } else {
        alert("Failed to save employee. Please try again.");
      }
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("company_token");
      await axios.delete(`http://localhost:8000/employee/${id}`, {
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
    const { name, value, files } = e.target;
    if (name === "file" && files && files[0]) {
      setFile(files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("company_token");
      const res = await axios.get("http://localhost:8000/company/emp_list", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Fetched employees:", res.data);

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
    <div className="min-h-screen bg-white p-8">
        <Navbar />
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
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
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Employee</h3>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete {showDeleteConfirm.name}?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto text-left">
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-bold text-gray-900 mt-10">Employee Enrollment</h1>
          <p className="text-gray-600 mt-1">Add and manage employee profiles for face recognition</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Enroll New Employee</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Employee Photo *
                </label>

                <div className="mb-4">
                  {preview ? (
                    <div className="w-full h-48 border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src={preview} alt="Preview" className="max-w-full max-h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                      <Camera className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Upload employee photo</span>
                    </div>
                  )}
                </div>

                <label className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Choose Photo</span>
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={handleChange}
                    required
                    className="hidden"
                  />
                </label>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Recommended: Clear, front-facing photo for better recognition accuracy
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    name="emp_id"
                    value={form.emp_id}
                    onChange={handleChange}
                    placeholder="Enter employee ID (e.g., EMP001)"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g., testing@gmail.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-gray-50"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Enrollment Tips</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Use a clear, front-facing photo</li>
                    <li>• Ensure good lighting</li>
                    <li>• Employee should look directly at camera</li>
                    <li>• Avoid shadows on the face</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={!form.name || !form.emp_id || !file}
                  className={`w-full mt-4 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors
                    ${!form.name || !form.emp_id || !file
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Enroll Employee
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Enrolled Employees</h2>
            <span className="text-sm font-medium text-gray-600">{employees.length} Employees</span>
          </div>

          <div className="space-y-3">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                    {employee.image_path ? (
                      <img
                        src={`http://localhost:8000/${employee.image_path}`}
                        alt={employee.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-12 h-12 rounded-full ${employee.color} flex items-center justify-center text-lg font-semibold`}
                    >
                      {employee.initials}
                    </div>
                  </div>
                  <div>
                    {editingId === employee.id ? (
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1">ID:</label>
                          <input
                            type="text"
                            value={form.emp_id}
                            onChange={(e) => setForm({ ...form, emp_id: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-24"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1">Name:</label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-32"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1">Email:</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-40"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-gray-900">{employee.name}</h3>
                        <p className="text-sm text-gray-500">ID: {employee.employee_id} | Email: {employee.email}</p>
                        <p className="text-xs text-gray-400">Points: {employee.point_total}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editingId === employee.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSubmit}
                        className="flex items-center gap-1 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(employee)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                  )}

                  <button
                    onClick={() => confirmDelete(employee.id, employee.name)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
            {employees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No employees enrolled yet. Add your first employee above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;