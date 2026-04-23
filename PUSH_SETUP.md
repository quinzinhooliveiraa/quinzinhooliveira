# Setup de Notificações Push (Web Push)

Já está tudo no código. Falta só configurar 3 coisas no Supabase para o push funcionar com o app fechado.

## 1) Aplicar as migrations

As novas migrations são:
- `20260423190000_realtime_contact_submissions.sql` (realtime de mensagens)
- `20260423191000_web_push_setup.sql` (tabela de subscriptions + triggers)

Pelo Supabase CLI:
```bash
supabase db push
```

## 2) Adicionar os secrets na função send-push

No painel do Supabase → **Edge Functions → send-push → Secrets**, adicione:

| Nome | Valor |
|---|---|
| `VAPID_PUBLIC_KEY` | `BK0OwdFsJyyHsvwNbkYQ6QDUJ24A2weyC0woM6efUacpgam6ObxP_EhNad0RTfEjOVHckDGipC1VSYVLmKYRm8c` |
| `VAPID_PRIVATE_KEY` | `0yh9kAm9xUBxAp30ywj858bZIAxnv_CQ0otupzu6FC0` |
| `VAPID_SUBJECT` | `mailto:seu-email@dominio.com` |

> A chave pública também já está no código frontend (`src/lib/pwa.ts`).
> Não compartilhe a privada.

## 3) Configurar as variáveis do banco para os triggers

Os triggers do banco precisam saber a URL da função e a service_role key.
Rode no SQL Editor do Supabase:

```sql
ALTER DATABASE postgres SET app.send_push_url
  = 'https://stenwonxizmhopfmcggr.supabase.co/functions/v1/send-push';

ALTER DATABASE postgres SET app.service_role_key
  = 'COLE_AQUI_A_SUA_SERVICE_ROLE_KEY';
```

A `service_role_key` está em **Project Settings → API → service_role**.

Depois reinicie a conexão (basta abrir uma nova query) para o postgres pegar
os novos `current_setting()`.

## 4) Deploy da função

```bash
supabase functions deploy send-push
```

## Pronto

Entre no painel admin (já instalado como app), clique em **Ativar notificações**
e aceite a permissão. Toda visita nova ao site e mensagem do contato vão chegar
como push, mesmo com o celular bloqueado.
