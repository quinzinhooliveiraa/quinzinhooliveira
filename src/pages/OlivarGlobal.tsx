import { ArrowRight, Globe, DollarSign, TrendingUp } from "lucide-react";
import SEO from "@/components/SEO";
import { AdminEditableLink } from "@/components/admin/AdminEditableLink";

const OlivarGlobal = () => {
  return (
    <div className="pt-14 sm:pt-16 [--primary:142_76%_36%] [--primary-foreground:0_0%_100%]">
      <SEO
        title="Olivar Global — Agência de Comércio Exterior"
        description="Agência de comércio exterior conectando o Brasil ao mercado internacional. Importação, exportação e consultoria com a Olivar Global."
      />
      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center bg-gradient-to-br from-background via-secondary/20 to-background overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(142_76%_36%_/_0.15),transparent_50%)]" />
        
        <div className="relative section-container w-full">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[hsl(142_76%_36%_/_0.1)] border border-[hsl(142_76%_36%_/_0.2)] rounded-full mb-4 sm:mb-6">
              <Globe size={14} className="text-[hsl(142_76%_36%)]" />
              <span className="text-xs sm:text-sm font-medium text-[hsl(142_76%_36%)]">Olivar Global Sales</span>
            </div>
            
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6">
              Time comercial sob medida fechando contratos em{" "}
              <span className="text-[hsl(142_76%_36%)]">dólar e euro</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
              Estrutura completa de vendas internacionais para agências e empresas que querem escalar em moeda forte.
            </p>

            {/* Key Benefits */}
            <div className="grid sm:grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12 max-w-3xl mx-auto">
              <div className="p-4 sm:p-6 bg-background/50 backdrop-blur border border-border rounded-xl">
                <DollarSign className="text-[hsl(142_76%_36%)] mb-2 sm:mb-3 mx-auto" size={28} />
                <h3 className="font-heading font-bold mb-1 sm:mb-2 text-sm sm:text-base">Moeda Forte</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Contratos em USD/EUR com clientes internacionais</p>
              </div>
              
              <div className="p-4 sm:p-6 bg-background/50 backdrop-blur border border-border rounded-xl">
                <Globe className="text-[hsl(142_76%_36%)] mb-2 sm:mb-3 mx-auto" size={28} />
                <h3 className="font-heading font-bold mb-1 sm:mb-2 text-sm sm:text-base">Closers Nativos</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Executivos em inglês e espanhol fechando por você</p>
              </div>
              
              <div className="p-4 sm:p-6 bg-background/50 backdrop-blur border border-border rounded-xl">
                <TrendingUp className="text-[hsl(142_76%_36%)] mb-2 sm:mb-3 mx-auto" size={28} />
                <h3 className="font-heading font-bold mb-1 sm:mb-2 text-sm sm:text-base">Processo Validado</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">+50 empresas já escalando internacionalmente</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <AdminEditableLink
                settingKey="olivar_cta_site"
                defaultHref="https://olivarglobal.com"
                external
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[hsl(142_76%_36%)] text-white font-bold rounded-lg transition-opacity hover:opacity-90 uppercase tracking-wide text-xs sm:text-sm"
              >
                Acessar Site Oficial
                <ArrowRight size={16} />
              </AdminEditableLink>
              
              <AdminEditableLink
                settingKey="olivar_cta_agendar"
                defaultHref="https://olivarglobal.com/#form"
                external
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-border text-foreground font-medium rounded-lg transition-colors hover:border-[hsl(142_76%_36%)] hover:text-[hsl(142_76%_36%)] text-xs sm:text-sm"
              >
                Agendar Conversa
              </AdminEditableLink>
            </div>

            <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground">
              Operação comercial internacional completa • Da prospecção ao fechamento
            </p>
          </div>
        </div>
      </section>

      {/* Simple Info Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/30">
        <div className="section-container max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Para quem realmente quer vender fora do Brasil
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A Olivar Global Sales é o braço comercial internacional de agências e empresas que já têm boa entrega, 
            mas precisam de uma estrutura profissional para conversar, negociar e fechar com clientes no exterior.
          </p>
          
          <AdminEditableLink
            settingKey="olivar_link_saibamais"
            defaultHref="https://olivarglobal.com"
            external
            className="inline-flex items-center gap-2 mt-8 text-[hsl(142_76%_36%)] font-medium transition-opacity hover:opacity-80"
          >
            Saiba mais no site oficial
            <ArrowRight size={18} />
          </AdminEditableLink>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-10 sm:py-14">
        <div className="section-container text-center">
          <p className="text-muted-foreground text-sm mb-4">Acompanhe a Olivar Global nas redes</p>
          <div className="flex justify-center gap-4">
            <AdminEditableLink settingKey="olivar_social_instagram" defaultHref="https://www.instagram.com/olivarglobalsale" external className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-full hover:border-[hsl(142_76%_36%)]/30 transition-colors text-sm font-medium">
              Instagram
            </AdminEditableLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OlivarGlobal;
