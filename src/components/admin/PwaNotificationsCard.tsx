import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Download, Check, BellOff, Smartphone } from "lucide-react";
import {
  canInstall,
  getPushSubscription,
  isStandalone,
  onInstallAvailabilityChange,
  promptInstall,
  requestNotificationPermission,
  showNotification,
  unsubscribePush,
} from "@/lib/pwa";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const PwaNotificationsCard = () => {
  const { toast } = useToast();
  const [installable, setInstallable] = useState(canInstall());
  const [installed, setInstalled] = useState(isStandalone());
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "denied"
  );

  useEffect(() => onInstallAvailabilityChange(setInstallable), []);

  useEffect(() => {
    const onChange = () => setInstalled(isStandalone());
    window.matchMedia?.("(display-mode: standalone)").addEventListener?.("change", onChange);
    return () =>
      window.matchMedia?.("(display-mode: standalone)").removeEventListener?.("change", onChange);
  }, []);

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === "accepted") {
      toast({ title: "App instalado!", description: "Agora você pode abrir direto da tela inicial." });
    } else if (result === "unavailable") {
      toast({
        title: "Instalação não disponível",
        description:
          "No iPhone: toque em Compartilhar → Adicionar à Tela de Início. No Android/desktop: use o menu do navegador.",
      });
    }
  };

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result !== "granted") {
      toast({
        title: "Notificações bloqueadas",
        description: "Habilite nas configurações do navegador para receber avisos.",
        variant: "destructive",
      });
      return;
    }

    const sub = await getPushSubscription();
    if (sub) {
      try {
        await api.post("/admin/push-subscriptions", {
          endpoint: sub.endpoint,
          p256dh: sub.p256dh,
          auth: sub.auth,
          userAgent: navigator.userAgent,
        });
      } catch (err) {
        console.warn("[PWA] failed to register push subscription", err);
      }
    }

    toast({
      title: "Notificações ativadas!",
      description: sub
        ? "Você receberá avisos mesmo com o app fechado."
        : "Avisos ativos enquanto o app estiver aberto.",
    });
    setTimeout(() => {
      showNotification(
        "Notificações ativas ✅",
        "Você verá um aviso aqui quando alguém visitar o site.",
        "/admin",
        "welcome"
      );
    }, 600);
  };

  const handleDisableNotifications = async () => {
    try {
      const sub = await navigator.serviceWorker.ready
        .then((r) => r.pushManager.getSubscription())
        .catch(() => null);
      if (sub) {
        await api.del("/admin/push-subscriptions", { endpoint: sub.endpoint }).catch(() => null);
      }
      await unsubscribePush();
      toast({ title: "Push desativado", description: "Você não receberá mais notificações em segundo plano." });
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Smartphone size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-bold text-base">App e Notificações</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Instale o app no celular e receba avisos de novas visitas e mensagens em tempo real.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {installed ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 text-green-500 rounded-lg text-xs font-medium">
            <Check size={14} /> App instalado
          </div>
        ) : installable ? (
          <Button onClick={handleInstall} size="sm" className="gap-2">
            <Download size={14} /> Instalar app
          </Button>
        ) : (
          <Button onClick={handleInstall} variant="outline" size="sm" className="gap-2">
            <Download size={14} /> Como instalar
          </Button>
        )}

        {permission === "granted" ? (
          <>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 text-green-500 rounded-lg text-xs font-medium">
              <Check size={14} /> Notificações ativas
            </div>
            <Button onClick={handleDisableNotifications} variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <BellOff size={14} /> Desativar push
            </Button>
          </>
        ) : permission === "denied" ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive rounded-lg text-xs font-medium">
            <BellOff size={14} /> Bloqueadas no navegador
          </div>
        ) : (
          <Button onClick={handleEnableNotifications} variant="outline" size="sm" className="gap-2">
            <Bell size={14} /> Ativar notificações
          </Button>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
        Dica: para receber avisos com o app fechado, mantenha-o instalado e logado. As notificações chegam
        sempre que o painel está aberto em segundo plano.
      </p>
    </div>
  );
};

export default PwaNotificationsCard;
