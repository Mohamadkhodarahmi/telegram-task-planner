# مشکل: TOKEN در Worker bind نشده است

## مشکل:
در output deployment می‌بینیم که TOKEN در لیست bindings نیست:
```
Binding                                                                   Resource                  
env.TELEGRAM_WEBAPP_URL ("https://dde9f6b1.telegram-study-plann...")      Environment Variable      
env.SECRET ("telegram-study-planner-secret-2024-ab...")                   Environment Variable      
```

TOKEN نیست!

## راه حل:

### روش 1: بررسی secret
```bash
wrangler secret list
```

باید TOKEN را ببینید.

### روش 2: حذف و تنظیم مجدد
```bash
# حذف secret قدیمی (اگر وجود دارد)
wrangler secret delete TOKEN

# تنظیم مجدد
wrangler secret put TOKEN
```

وقتی از شما خواست، token را وارد کنید:
```
<YOUR_BOT_TOKEN>
```

### روش 3: بررسی wrangler.toml
مطمئن شوید که TOKEN در `[vars]` نیست (باید secret باشد، نه var).

### روش 4: Deploy مجدد
بعد از تنظیم secret:
```bash
wrangler deploy
```

باید در output ببینید که TOKEN bind شده است.

## اگر هنوز کار نکرد:

ممکن است نیاز باشد که secret را در Cloudflare Dashboard تنظیم کنید:
1. بروید به Cloudflare Dashboard
2. Workers & Pages → Your Worker
3. Settings → Variables
4. Secrets → Add Secret
5. Name: TOKEN
6. Value: token ربات شما




