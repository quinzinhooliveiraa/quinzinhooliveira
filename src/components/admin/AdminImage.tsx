import { useSiteSetting } from "@/hooks/use-site-settings";
import { AdminImageOverlay } from "@/components/admin/AdminImageOverlay";

interface AdminImageProps {
  settingKey: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
}

/**
 * Image that can be swapped by admin via upload.
 * Falls back to the static import if no DB override exists.
 */
export function AdminImage({ settingKey, fallbackSrc, alt, className = "", containerClassName = "", style }: AdminImageProps) {
  const { value: src, update } = useSiteSetting(settingKey, fallbackSrc);

  return (
    <AdminImageOverlay settingKey={settingKey} currentSrc={src} onUpdate={update} className={containerClassName}>
      <img src={src} alt={alt} className={className} style={style} loading="lazy" />
    </AdminImageOverlay>
  );
}
