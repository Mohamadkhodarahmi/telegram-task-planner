# بررسی Deploy شدن تغییرات

## روش‌های بررسی:

### 1. بررسی URL Pages در مرورگر

باز کردن این URL در مرورگر:
```
https://53828200.telegram-study-planner.pages.dev
```

**چک کنید:**
- آیا صفحه باز می‌شود؟
- آیا تغییرات جدید را می‌بینید؟
- Console را باز کنید (F12) و بررسی کنید که فایل‌های جدید لود شده‌اند

### 2. بررسی Cache

اگر تغییرات را نمی‌بینید، ممکن است cache باشد:

**در Chrome:**
- Ctrl + Shift + R (Hard Refresh)
- یا F12 → Network tab → "Disable cache" را فعال کنید → Refresh

**در Telegram:**
- Mini App را ببندید
- دوباره باز کنید
- یا در Telegram Desktop: Settings → Advanced → Clear cache

### 3. بررسی فایل‌های Deploy شده

می‌توانید مستقیماً فایل‌های CSS و JS را بررسی کنید:

**CSS:**
```
https://53828200.telegram-study-planner.pages.dev/styles.css
```

**JS:**
```
https://53828200.telegram-study-planner.pages.dev/app.js
```

در مرورگر باز کنید و بررسی کنید که کد جدید در آن‌ها هست.

### 4. بررسی Worker

Worker URL:
```
https://telegram-study-planner.mohamadfiery.workers.dev
```

برای تست API:
```
https://telegram-study-planner.mohamadfiery.workers.dev/api/user/123
```

باید JSON response ببینید.

### 5. بررسی در Cloudflare Dashboard

1. بروید به [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Workers & Pages → Pages
3. پروژه "telegram-study-planner" را پیدا کنید
4. بررسی کنید آخرین deployment چه زمانی بوده
5. بررسی کنید که deployment موفق بوده

### 6. بررسی با wrangler

```bash
# بررسی آخرین deployment
wrangler pages deployment list --project-name=telegram-study-planner

# یا بررسی worker
wrangler deployments list
```

### 7. تست در Telegram

1. Mini App را ببندید
2. دوباره باز کنید (از ربات `/start` → "Open Study Planner")
3. تغییرات را بررسی کنید

## اگر تغییرات را نمی‌بینید:

### مشکل Cache:
- Hard Refresh: Ctrl + Shift + R
- Clear browser cache
- Clear Telegram cache

### مشکل Deploy:
- بررسی کنید deployment موفق بوده
- بررسی کنید URL درست است
- دوباره deploy کنید

### مشکل URL:
- بررسی کنید `TELEGRAM_WEBAPP_URL` در wrangler.toml درست است
- بررسی کنید Worker با URL جدید deploy شده

## Quick Check:

```bash
# بررسی آخرین deployment
wrangler pages deployment list --project-name=telegram-study-planner

# بررسی worker deployments
wrangler deployments list
```




