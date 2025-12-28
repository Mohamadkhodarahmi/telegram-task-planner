# راهنمای رفع مشکل ربات تلگرام

## مشکل: ربات به /start پاسخ نمی‌دهد

### مرحله 1: بررسی Webhook

Webhook باید ثبت شده باشد. برای ثبت:

**در مرورگر این آدرس را باز کنید:**
```
https://telegram-study-planner.mohamadfiery.workers.dev/registerWebhook
```

باید پیام "Webhook registered successfully!" را ببینید.

### مرحله 2: بررسی Token ربات

مطمئن شوید که TOKEN ربات تنظیم شده:

```bash
wrangler secret list
```

اگر TOKEN وجود ندارد:
```bash
wrangler secret put TOKEN
```
سپس token ربات خود را از @BotFather وارد کنید.

### مرحله 3: بررسی SECRET

در فایل `wrangler.toml` باید SECRET تنظیم شده باشد:

```toml
[vars]
SECRET = "your-secret-token-here"
```

این باید یک رشته تصادفی باشد (حداقل 32 کاراکتر).

### مرحله 4: تست ربات

برای تست کامل:

```bash
node test-bot.js
```

این اسکریپت بررسی می‌کند:
- ✅ ربات فعال است
- ✅ Webhook ثبت شده
- ✅ Endpoint در دسترس است

### مرحله 5: بررسی لاگ‌ها

برای دیدن خطاها:

```bash
wrangler tail
```

سپس در تلگرام به ربات `/start` بفرستید و لاگ‌ها را ببینید.

## مشکلات رایج:

### 1. ربات هیچ پاسخی نمی‌دهد
**علت:** Webhook ثبت نشده
**راه حل:** 
- باز کردن: `https://telegram-study-planner.mohamadfiery.workers.dev/registerWebhook`
- یا اجرای: `npm run set-webhook`

### 2. خطای "Unauthorized"
**علت:** SECRET در wrangler.toml با webhook مطابقت ندارد
**راه حل:** 
- SECRET را در wrangler.toml تغییر دهید
- Worker را دوباره deploy کنید: `wrangler deploy`
- Webhook را دوباره ثبت کنید

### 3. خطای "Bad Request"
**علت:** TOKEN اشتباه است
**راه حل:**
- بررسی TOKEN از @BotFather
- تنظیم مجدد: `wrangler secret put TOKEN`

### 4. Worker خطا می‌دهد
**علت:** کد Worker مشکل دارد
**راه حل:**
- بررسی لاگ‌ها: `wrangler tail`
- بررسی کد در `src/index.ts`

## چک‌لیست سریع:

- [ ] Worker deploy شده: `wrangler deploy`
- [ ] TOKEN تنظیم شده: `wrangler secret put TOKEN`
- [ ] SECRET در wrangler.toml تنظیم شده
- [ ] Webhook ثبت شده: `/registerWebhook`
- [ ] ربات تست شده: `/start` در تلگرام
- [ ] لاگ‌ها بررسی شده: `wrangler tail`

## تست نهایی:

1. در تلگرام ربات را باز کنید
2. `/start` بفرستید
3. باید پیام خوش‌آمدگویی با دکمه "Open Study Planner" را ببینید

اگر کار نکرد، خروجی `wrangler tail` را بررسی کنید.




