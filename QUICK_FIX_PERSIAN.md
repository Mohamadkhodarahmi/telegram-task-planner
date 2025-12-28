# راهنمای سریع: رفع مشکل ربات

## مشکل: ربات به /start پاسخ نمی‌دهد

### ✅ مرحله 1: Webhook را ثبت کنید

Webhook ثبت شد! اما اگر هنوز کار نمی‌کند:

**باز کردن این آدرس در مرورگر:**
```
https://telegram-study-planner.mohamadfiery.workers.dev/registerWebhook
```

### ✅ مرحله 2: بررسی SECRET

در `wrangler.toml` مقدار SECRET باید تغییر کند:

**فعلی (اشتباه):**
```toml
SECRET = "your-secret-token-here"
```

**باید یک رشته تصادفی باشد، مثلاً:**
```toml
SECRET = "my-super-secret-token-12345-abcdef"
```

**برای تولید SECRET جدید:**
- می‌توانید هر رشته تصادفی استفاده کنید
- حداقل 32 کاراکتر بهتر است
- فقط حروف و اعداد و خط تیره

### ✅ مرحله 3: Redeploy Worker

بعد از تغییر SECRET:

```bash
wrangler deploy
```

### ✅ مرحله 4: ثبت مجدد Webhook

بعد از deploy:

```
https://telegram-study-planner.mohamadfiery.workers.dev/registerWebhook
```

### ✅ مرحله 5: تست ربات

1. در تلگرام ربات را باز کنید
2. `/start` بفرستید
3. باید پاسخ بگیرید!

## بررسی لاگ‌ها

اگر هنوز کار نمی‌کند:

```bash
wrangler tail
```

سپس در تلگرام `/start` بفرستید و لاگ‌ها را ببینید.

## تست کامل

برای تست کامل سیستم:

```bash
node test-bot.js
```

این اسکریپت همه چیز را بررسی می‌کند.

## خلاصه مراحل:

1. ✅ TOKEN تنظیم شده (بررسی شد)
2. ⚠️ SECRET را تغییر دهید
3. ⚠️ Worker را deploy کنید
4. ⚠️ Webhook را ثبت کنید
5. ⚠️ ربات را تست کنید




