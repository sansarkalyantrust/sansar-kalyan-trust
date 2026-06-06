"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw } from "lucide-react";

interface SettingsData {
  homepage?: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroCTA?: string;
    impactFamilies?: number;
    impactEvents?: number;
    impactVolunteers?: number;
    impactDonations?: number;
  };
  about?: {
    mission?: string;
    vision?: string;
    description?: string;
  };
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  footer?: {
    copyrightText?: string;
    newsletterEnabled?: boolean;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"homepage" | "about" | "contact" | "social" | "footer">("homepage");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.data || getDefaultSettings());
      } else {
        setSettings(getDefaultSettings());
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setSettings(getDefaultSettings());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSettings = (): SettingsData => ({
    homepage: {
      heroTitle: "Empowering Communities, Transforming Lives",
      heroSubtitle: "Join us in creating positive change through healthcare, education, and community development.",
      heroCTA: "Donate Now",
      impactFamilies: 1000,
      impactEvents: 50,
      impactVolunteers: 200,
      impactDonations: 5000000,
    },
    about: {
      mission: "To empower underprivileged communities through sustainable healthcare, education, and social welfare initiatives.",
      vision: "A society where every individual has access to quality healthcare, education, and opportunities for growth.",
      description: "Sansar Kalyan Trust is a non-profit organization dedicated to serving communities...",
    },
    contact: {
      address: "Sector 5, Rohtak, Haryana, India",
      phone: "+91 98765 43210",
      email: "info@sansarkalyan.org",
      whatsapp: "+91 98765 43210",
    },
    social: {
      facebook: "https://facebook.com/sansarkalyantrust",
      twitter: "https://twitter.com/sansarkalyan",
      instagram: "https://instagram.com/sansarkalyantrust",
      linkedin: "",
      youtube: "",
    },
    footer: {
      copyrightText: "© 2024 Sansar Kalyan Trust. All rights reserved.",
      newsletterEnabled: true,
    },
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      setSettings(getDefaultSettings());
    }
  };

  const updateField = (section: keyof SettingsData, field: string, value: any) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  const tabs = [
    { id: "homepage", label: "Homepage" },
    { id: "about", label: "About Page" },
    { id: "contact", label: "Contact Info" },
    { id: "social", label: "Social Links" },
    { id: "footer", label: "Footer" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg"
        >
          Settings saved successfully!
        </motion.div>
      )}

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Homepage Settings */}
      {activeTab === "homepage" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-lg border bg-card space-y-4">
            <h3 className="text-lg font-semibold">Hero Section</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Hero Title</label>
              <input
                type="text"
                value={settings.homepage?.heroTitle || ""}
                onChange={(e) => updateField("homepage", "heroTitle", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
              <textarea
                value={settings.homepage?.heroSubtitle || ""}
                onChange={(e) => updateField("homepage", "heroSubtitle", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">CTA Button Text</label>
              <input
                type="text"
                value={settings.homepage?.heroCTA || ""}
                onChange={(e) => updateField("homepage", "heroCTA", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Donate Now"
              />
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card space-y-4">
            <h3 className="text-lg font-semibold">Impact Statistics</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Families Helped</label>
                <input
                  type="number"
                  value={settings.homepage?.impactFamilies || 0}
                  onChange={(e) => updateField("homepage", "impactFamilies", Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Events Conducted</label>
                <input
                  type="number"
                  value={settings.homepage?.impactEvents || 0}
                  onChange={(e) => updateField("homepage", "impactEvents", Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Active Volunteers</label>
                <input
                  type="number"
                  value={settings.homepage?.impactVolunteers || 0}
                  onChange={(e) => updateField("homepage", "impactVolunteers", Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Total Donations (₹)</label>
                <input
                  type="number"
                  value={settings.homepage?.impactDonations || 0}
                  onChange={(e) => updateField("homepage", "impactDonations", Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* About Settings */}
      {activeTab === "about" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border bg-card space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Mission Statement</label>
            <textarea
              value={settings.about?.mission || ""}
              onChange={(e) => updateField("about", "mission", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vision Statement</label>
            <textarea
              value={settings.about?.vision || ""}
              onChange={(e) => updateField("about", "vision", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">About Description</label>
            <textarea
              value={settings.about?.description || ""}
              onChange={(e) => updateField("about", "description", e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </motion.div>
      )}

      {/* Contact Settings */}
      {activeTab === "contact" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border bg-card space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea
              value={settings.contact?.address || ""}
              onChange={(e) => updateField("contact", "address", e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={settings.contact?.phone || ""}
                onChange={(e) => updateField("contact", "phone", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={settings.contact?.email || ""}
                onChange={(e) => updateField("contact", "email", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
              <input
                type="tel"
                value={settings.contact?.whatsapp || ""}
                onChange={(e) => updateField("contact", "whatsapp", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Social Links */}
      {activeTab === "social" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border bg-card space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Facebook URL</label>
            <input
              type="url"
              value={settings.social?.facebook || ""}
              onChange={(e) => updateField("social", "facebook", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Twitter URL</label>
            <input
              type="url"
              value={settings.social?.twitter || ""}
              onChange={(e) => updateField("social", "twitter", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="https://twitter.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Instagram URL</label>
            <input
              type="url"
              value={settings.social?.instagram || ""}
              onChange={(e) => updateField("social", "instagram", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={settings.social?.linkedin || ""}
              onChange={(e) => updateField("social", "linkedin", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="https://linkedin.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">YouTube URL</label>
            <input
              type="url"
              value={settings.social?.youtube || ""}
              onChange={(e) => updateField("social", "youtube", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="https://youtube.com/..."
            />
          </div>
        </motion.div>
      )}

      {/* Footer Settings */}
      {activeTab === "footer" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border bg-card space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Copyright Text</label>
            <input
              type="text"
              value={settings.footer?.copyrightText || ""}
              onChange={(e) => updateField("footer", "copyrightText", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.footer?.newsletterEnabled || false}
              onChange={(e) => updateField("footer", "newsletterEnabled", e.target.checked)}
              className="rounded"
            />
            <label className="text-sm font-medium">Enable Newsletter Signup</label>
          </div>
        </motion.div>
      )}
    </div>
  );
}
