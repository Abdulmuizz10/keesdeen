import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  X,
  Plus,
  Upload,
  GripVertical,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Axios from "axios";
import { URL } from "@/lib/constants";

interface HeroImage {
  _id?: string;
  url: string;
  tagline: string;
  isActive: boolean;
  order: number;
  preview?: string;
}

const AdminHeroSettings: React.FC = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [transitionDuration, setTransitionDuration] = useState<number>(1000);
  const [autoPlayInterval, setAutoPlayInterval] = useState<number>(5000);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      const res = await Axios.get(`${URL}/settings/admin/get-hero`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const sortedImages = [...res.data.data.images].sort(
          (a, b) => a.order - b.order
        );
        setHeroImages(sortedImages);
        setTransitionDuration(res.data.data.transitionDuration);
        setAutoPlayInterval(res.data.data.autoPlayInterval);
      }
    } catch (error) {
      toast.error("Failed to fetch hero settings");
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    formData.append("folder", "hero_images");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      }
      throw new Error("Upload failed");
    } catch (error) {
      throw error;
    }
  };

  const handleAddImage = () => {
    const newImage: HeroImage = {
      url: "",
      tagline: "",
      isActive: true,
      order: heroImages.length,
      preview: "",
    };
    setHeroImages([...heroImages, newImage]);
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);

    // Create preview immediately for better UX
    const preview = window.URL.createObjectURL(file);
    const updatedImages = [...heroImages];
    updatedImages[index] = {
      ...updatedImages[index],
      preview,
    };
    setHeroImages(updatedImages);

    try {
      const url = await uploadToCloudinary(file);

      const finalImages = [...heroImages];
      finalImages[index] = {
        ...finalImages[index],
        url,
        preview,
      };
      setHeroImages(finalImages);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      // Remove preview on failure
      const revertedImages = [...heroImages];
      revertedImages[index] = {
        ...revertedImages[index],
        preview: "",
      };
      setHeroImages(revertedImages);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleUpdateImage = (
    index: number,
    field: keyof HeroImage,
    value: any
  ) => {
    const updatedImages = [...heroImages];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value,
    };
    setHeroImages(updatedImages);
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = heroImages.filter((_, i) => i !== index);
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      order: i,
    }));
    setHeroImages(reorderedImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedImages = [...heroImages];
    const draggedItem = updatedImages[draggedIndex];
    updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(index, 0, draggedItem);

    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      order: i,
    }));

    setHeroImages(reorderedImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    const invalidImages = heroImages.filter((img) => !img.url || !img.tagline);
    if (invalidImages.length > 0) {
      toast.error("Please complete all image fields");
      return;
    }

    setSaving(true);
    try {
      const res = await Axios.put(
        `${URL}/settings/admin/update-hero`,
        {
          images: heroImages.map(({ preview, ...img }) => img),
          transitionDuration,
          autoPlayInterval,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Hero settings saved successfully");
        fetchHeroSettings();
      }
    } catch (error) {
      toast.error("Failed to save hero settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="animate-spin h-12 w-12 border-4 border-foreground/20 border-t-foreground rounded-full" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-foreground animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading hero settings...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Enhanced Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Create stunning first impressions with dynamic hero images and
              compelling taglines
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-muted/50 border border-border">
            <Sparkles className="h-4 w-4 text-foreground" />
            <span className="text-xs font-medium">
              {heroImages.filter((img) => img.isActive).length} Active
            </span>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
      </div>

      <div className="space-y-12 lg:space-y-16">
        {/* Hero Images Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl lg:text-2xl font-light tracking-tight mb-2 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Hero Gallery
              </h2>
              <p className="text-xs text-muted-foreground">
                Upload high-resolution images • Add impactful taglines • Drag to
                reorder
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddImage}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">Add Hero Image</span>
            </button>
          </div>

          {/* Images Grid */}
          <div className="space-y-6">
            {heroImages.map((image, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative border border-border bg-card hover:border-foreground/20 transition-all duration-300 overflow-hidden ${
                  draggedIndex === index
                    ? "opacity-50 scale-95"
                    : "hover:shadow-xl"
                }`}
              >
                {/* Order Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <span className="text-xs font-semibold">#{index + 1}</span>
                </div>

                {/* Status Badge */}
                {image.isActive && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      Live
                    </span>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 p-6">
                  {/* Large Image Preview */}
                  <div className="relative w-full lg:w-[500px] h-[280px] lg:h-[320px] border-2 border-border bg-muted/30 flex-shrink-0 overflow-hidden group/image">
                    {image.url || image.preview ? (
                      <>
                        <img
                          src={image.preview || image.url}
                          alt={`Hero ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                        />

                        {/* Upload Overlay with Loader */}
                        {uploadingIndex === index && (
                          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                            <div className="relative">
                              <div className="animate-spin h-16 w-16 border-4 border-foreground/20 border-t-foreground rounded-full" />
                              <Upload className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 text-foreground animate-pulse" />
                            </div>
                            <div className="text-center space-y-1">
                              <p className="text-sm font-medium">
                                Uploading to cloud...
                              </p>
                              <p className="text-xs text-muted-foreground">
                                This may take a moment
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Success Checkmark */}
                        {image.url && uploadingIndex !== index && (
                          <div className="absolute top-4 left-4 p-2 bg-green-500 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}

                        {/* Change Image Button */}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/image:opacity-100 transition-all duration-300 cursor-pointer">
                          <div className="flex flex-col items-center gap-2 text-white">
                            <Upload className="h-8 w-8" />
                            <span className="text-sm font-medium">
                              Change Image
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(index, file);
                            }}
                            className="hidden"
                            disabled={uploadingIndex === index}
                          />
                        </label>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-all duration-300 border-2 border-dashed border-border hover:border-foreground/40 group/upload">
                        <div className="flex flex-col items-center gap-4 text-center px-6">
                          <div className="p-4 bg-muted rounded-full group-hover/upload:bg-foreground/10 transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground group-hover/upload:text-foreground transition-colors" />
                          </div>
                          <div>
                            <p className="font-medium mb-1">
                              Upload Hero Image
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Recommended: 1920x1080px or higher
                            </p>
                          </div>
                          <div className="px-4 py-2 bg-foreground text-background text-xs font-medium rounded-sm group-hover/upload:bg-foreground/90 transition-colors">
                            Browse Files
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(index, file);
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Image Details */}
                  <div className="flex-1 space-y-6">
                    {/* Tagline Input */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Tagline
                      </Label>
                      <input
                        type="text"
                        placeholder="e.g., Boundless, Dynamic, Fearless, Limitless"
                        value={image.tagline}
                        onChange={(e) =>
                          handleUpdateImage(index, "tagline", e.target.value)
                        }
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-background border border-input focus:outline-none focus:border-foreground transition-all duration-300 placeholder:text-muted-foreground/40"
                        disabled={uploadingIndex === index}
                      />
                      <p className="text-xs text-muted-foreground">
                        Keep it short and impactful • Will appear in large text
                        on hero
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border">
                      {/* Visibility Toggle */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-sm border border-border">
                        <Switch
                          checked={image.isActive}
                          onCheckedChange={(checked) =>
                            handleUpdateImage(index, "isActive", checked)
                          }
                          disabled={uploadingIndex === index}
                        />
                        <Label className="text-sm font-medium cursor-pointer">
                          {image.isActive ? (
                            <span className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-green-600" />
                              <span>Visible on Site</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Hidden
                              </span>
                            </span>
                          )}
                        </Label>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        disabled={uploadingIndex === index}
                        className="ml-auto flex items-center gap-2 px-4 py-3 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                    </div>

                    {/* Upload Status */}
                    {uploadingIndex === index && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-sm">
                        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          Uploading image to cloud storage...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {heroImages.length === 0 && (
              <div className="border-2 border-dashed border-border rounded-sm p-16 text-center bg-muted/20">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="p-6 bg-muted/50 rounded-full w-fit mx-auto">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">No Hero Images Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Start building your hero carousel by adding your first
                      stunning image
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">Add First Image</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Animation Settings */}
        <section className="space-y-6">
          <div className="pb-4 border-b border-border">
            <h2 className="text-xl lg:text-2xl font-light tracking-tight mb-2">
              Animation Settings
            </h2>
            <p className="text-sm text-muted-foreground">
              Fine-tune carousel timing and transition effects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 p-6 border border-border bg-card hover:border-foreground/20 transition-colors">
              <Label className="text-sm font-medium">
                Transition Duration (ms)
              </Label>
              <input
                type="number"
                value={transitionDuration}
                onChange={(e) => setTransitionDuration(Number(e.target.value))}
                className="w-full px-4 py-3 bg-background border-2 border-input focus:outline-none focus:border-foreground transition-all"
                min="100"
                step="100"
              />
              <p className="text-xs text-muted-foreground">
                ⚡ Controls fade speed • Recommended: 800-1500ms
              </p>
            </div>

            <div className="space-y-3 p-6 border border-border bg-card hover:border-foreground/20 transition-colors">
              <Label className="text-sm font-medium">
                Auto-play Interval (ms)
              </Label>
              <input
                type="number"
                value={autoPlayInterval}
                onChange={(e) => setAutoPlayInterval(Number(e.target.value))}
                className="w-full px-4 py-3 bg-background border-2 border-input focus:outline-none focus:border-foreground transition-all"
                min="1000"
                step="1000"
              />
              <p className="text-xs text-muted-foreground">
                ⏱️ Time between slides • Recommended: 4000-6000ms
              </p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border pt-6 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground hidden sm:block">
              {heroImages.length} image{heroImages.length !== 1 ? "s" : ""} •{" "}
              {heroImages.filter((img) => img.isActive).length} active •{" "}
              {heroImages.filter((img) => !img.url).length} pending upload
            </p>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => fetchHeroSettings()}
                disabled={saving}
                className="px-6 py-3 border-2 border-border hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-medium">Reset Changes</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || uploadingIndex !== null}
                className="flex items-center gap-2 px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="font-medium">Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="font-medium">Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeroSettings;
