# رفع مشکل: ربات به /start پاسخ نمی‌دهد

## مشکل: ربات به دستور /start پاسخ نمی‌دهد

این معمولاً به این معنی است که webhook تنظیم نشده است.

## راه حل سریع:

### مرحله 1: ثبت Webhook

بعد از deploy کردن Worker، باید webhook را ثبت کنید:

**روش 1: از طریق مرورگر (ساده‌ترین روش)**

باز کردن این آدرس در مرورگر:
```
https://telegram-study-planner.mohamadfiery.workers.dev/registerWebhook
```

باید پیام زیر را ببینید:
```
Webhook registered successfully!
```

**روش 2: از طریق اسکریپت**

```bash
npm run set-webhook
```

یا:
```bash
node scripts/set-webhook.js
```

### مرحله 2: بررسی Webhook

برای بررسی اینکه webhook ثبت شده است:

```bash
npm run check-webhook
```

یا باز کردن این آدرس در مرورگر:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

### مرحله 3: تست ربات

1. در تلگرام ربات خود را باز کنید
2. دستور `/start` را بفرستید
3. باید پیام خوش‌آمدگویی را ببینید

## مشکلات رایج:

### مشکل 1: Webhook ثبت نشده
**راه حل:** مراحل بالا را انجام دهید

### مشکل 2: Worker deploy نشده
**راه حل:**
```bash
wrangler deploy
```

### مشکل 3: TOKEN تنظیم نشده
**راه حل:**
```bash
wrangler secret put TOKEN
```
سپس token ربات خود را وارد کنید

### مشکل 4: SECRET اشتباه
**راه حل:** 
- بررسی کنید `SECRET` در `wrangler.toml` تنظیم شده
- باید با secret token در webhook یکسان باشد

## بررسی لاگ‌ها:

برای دیدن خطاها:
```bash
wrangler tail
```

سپس یک پیام به ربات بفرستید و لاگ‌ها را ببینید.

## چک‌لیست:

- [ ] Worker deploy شده: `wrangler deploy`
- [ ] TOKEN secret تنظیم شده: `wrangler secret put TOKEN`
- [ ] SECRET در wrangler.toml تنظیم شده
- [ ] Webhook ثبت شده: `/registerWebhook`
- [ ] ربات تست شده: `/start` در تلگرام

## اگر هنوز کار نمی‌کند:

1. لاگ‌ها را بررسی کنید: `wrangler tail`
2. Webhook را دوباره ثبت کنید
3. Worker را دوباره deploy کنید
4. بررسی کنید token ربات درست است




