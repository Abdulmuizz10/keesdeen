import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Upload } from "lucide-react";
import axiosInstance from "@/lib/axiosConfig";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  image: File | string | null;
  imagePreview: string | null;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    image: null,
    imagePreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handlePhoneChange = (phone: string) => {
    setFormData((prev) => ({ ...prev, phone }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      imagePreview: window.URL.createObjectURL(file),
    }));

    uploadToCloudinary(file);
  };

  const uploadToCloudinary = async (file: File) => {
    setUploadingImage(true);
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    form.append("folder", "contact_images");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        { method: "POST", body: form }
      );
      const data = await res.json();
      setFormData((prev) => ({ ...prev, image: data.secure_url }));
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Image upload failed");
      setFormData((prev) => ({ ...prev, image: null, imagePreview: null }));
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post(`/contact`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        imageUrl: formData.image,
      });
      if (res.status === 200) {
        toast.success("Sent successfully! We'll get back to you soon.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          image: null,
          imagePreview: null,
        });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="placing">
      {/* Header */}
      <div className="mb-5 lg:mb-10 border-b border-gray-200 pb-8">
        <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          <span>Contact Us</span>
        </h2>
        <p className="text-sm text-text-secondary">
          We're here to help — get in touch with us for any questions or
          support.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-8">
          {/* <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
              Customer Service
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Monday - Friday: 9:00 AM - 6:00 PM
            </p>
            <p className="text-sm text-gray-700">
              Saturday - Sunday: 10:00 AM - 4:00 PM
            </p>
          </div> */}

          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
              Contact Details
            </h3>
            <div className="space-y-3">
              <a
                href={`mailto:${
                  import.meta.env.VITE_CONTACT_EMAIL || "hello@keesdeen.com"
                }`}
                className="block text-sm text-gray-700 hover:text-black transition-colors"
              >
                {import.meta.env.VITE_CONTACT_EMAIL || "hello@keesdeen.com"}
              </a>
              <a
                href="tel:+1234567890"
                className="block text-sm text-gray-700 hover:text-black transition-colors"
              >
                +1 (234) 567-890
              </a>
            </div>
          </div>
          {/* 
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                Visit Us
              </h3>
              <address className="text-sm text-gray-700 not-italic">
                123 Fashion Avenue
                <br />
                New York, NY 10001
                <br />
                United States
              </address>
            </div> */}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-xs uppercase tracking-wider text-gray-700 mb-2"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-xs uppercase tracking-wider text-gray-700 mb-2"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-wider text-gray-700 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs uppercase tracking-wider text-gray-700 mb-2"
                >
                  Phone (Optional)
                </label>
                <PhoneInput
                  country="gb"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  containerStyle={{ width: "100%" }}
                  inputStyle={{
                    width: "100%",
                    border: "1px solid #d1d5db",
                    padding: "1.45rem 3rem",
                    fontSize: "0.875rem",
                    borderRadius: "0",
                  }}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-xs uppercase tracking-wider text-gray-700 mb-2"
              >
                Subject *
              </label>
              {/* <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors text-sm bg-white"
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="return">Returns & Exchanges</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select> */}

              <Select
                value={formData.subject}
                onValueChange={handleSubjectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>

                <SelectContent className="border border-gray-300 bg-white w-full">
                  <SelectItem
                    value="order"
                    className="cursor-pointer hover:text-gray-400"
                  >
                    Order Inquiry
                  </SelectItem>
                  <SelectItem
                    value="product"
                    className="cursor-pointer hover:text-gray-400"
                  >
                    Product Question
                  </SelectItem>
                  <SelectItem
                    value="shipping"
                    className="cursor-pointer hover:text-gray-400"
                  >
                    Shipping & Delivery
                  </SelectItem>
                  <SelectItem
                    value="return"
                    className="cursor-pointer hover:text-gray-400"
                  >
                    Returns & Exchanges
                  </SelectItem>
                  <SelectItem
                    value="feedback"
                    className="cursor-pointer hover:text-gray-400"
                  >
                    Feedback
                  </SelectItem>
                  <SelectItem
                    value="other"
                    className="cursor-pointer hover:text-gray-400"
                  >
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-xs uppercase tracking-wider text-gray-700 mb-2"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors text-sm resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2">
                Attach Image (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload a photo to help us better understand your inquiry (Max
                5MB)
              </p>

              {formData.imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 hover:border-black transition-colors cursor-pointer text-xs uppercase tracking-wider"
                  >
                    <Upload size={15} />
                    {uploadingImage ? "Uploading..." : "Select Image"}
                  </label>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || uploadingImage}
                className="w-full border border-gray-900 bg-gray-900 py-4 text-xs uppercase tracking-wider text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
