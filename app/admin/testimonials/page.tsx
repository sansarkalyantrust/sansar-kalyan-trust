"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  message: string;
  photo?: string;
  order: number;
  isActive: boolean;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    message: "",
    photo: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/testimonials/${editingId}`
        : "/api/testimonials";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        resetForm();
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Failed to save testimonial:", error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial._id);
    setFormData({
      name: testimonial.name,
      designation: testimonial.designation,
      message: testimonial.message,
      photo: testimonial.photo || "",
      order: testimonial.order,
      isActive: testimonial.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Failed to toggle testimonial:", error);
    }
  };

  const changeOrder = async (id: string, currentOrder: number, direction: "up" | "down") => {
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;
    
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      });

      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Failed to change order:", error);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", designation: "", message: "", photo: "", order: 0, isActive: true });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Testimonials Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border bg-card"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Designation *</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="CEO, Company"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Testimonial message..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Photo URL (optional)
              </label>
              <input
                type="text"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingId ? "Update" : "Create"} Testimonial
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Testimonials List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={`skeleton-${i}`} className="p-6 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No testimonials created yet.</p>
        </div>
      ) : (
        <motion.div layout className="space-y-4">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border bg-card"
            >
              <div className="flex items-start gap-4">
                {testimonial.photo && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.photo}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.designation}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          testimonial.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {testimonial.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{testimonial.message}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(testimonial._id, testimonial.isActive)}
                      className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      {testimonial.isActive ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Activate
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => changeOrder(testimonial._id, testimonial.order, "up")}
                      className="p-1.5 border rounded-lg hover:bg-muted transition-colors text-sm"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => changeOrder(testimonial._id, testimonial.order, "down")}
                      className="p-1.5 border rounded-lg hover:bg-muted transition-colors text-sm"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
