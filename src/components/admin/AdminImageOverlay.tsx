import { useState, useRef } from "react";
import { Camera, Check, X, Loader2 } from "lucide-react";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { supabase } from "@/integrations/supabase/client";

interface AdminImageOverlayProps {
  settingKey: string;
  currentSrc: string;
  onUpdate: (newUrl: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function AdminImageOverlay({ settingKey, currentSrc, onUpdate, children, className = "" }: AdminImageOverlayProps) {
  const { isAdmin } = useAdminStatus();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) return <>{children}</>;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${settingKey}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("site-images")
        .getPublicUrl(path);

      const publicUrl = urlData.publicUrl;

      // Save to site_settings
      await supabase
        .from("site_settings" as any)
        .upsert({ key: settingKey, value: publicUrl, updated_at: new Date().toISOString() } as any);

      onUpdate(publicUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`relative group/admin-img ${className}`}>
      {children}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="absolute top-2 right-2 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg opacity-0 group-hover/admin-img:opacity-100 transition-opacity shadow-lg disabled:opacity-50"
      >
        {uploading ? (
          <><Loader2 size={12} className="animate-spin" /> Enviando...</>
        ) : (
          <><Camera size={12} /> Trocar foto</>
        )}
      </button>
    </div>
  );
}
