# بررسی لاگ‌ها - الان

## کد به‌روزرسانی شد! ✅

لاگ‌گذاری اضافه شد تا ببینیم دقیقاً چه اتفاقی می‌افتد.

## حالا این کارها را انجام دهید:

### مرحله 1: لاگ‌ها را باز کنید
در یک ترمینال جدید:
```bash
wrangler tail
```

### مرحله 2: در تلگرام `/start` بفرستید

### مرحله 3: لاگ‌ها را ببینید

باید لاگ‌های زیر را ببینید:

```
[Webhook] Received message: /start from user 123456 in chat 123456
[Webhook] Handling /start command
[handleStartCommand] Starting for user 123456, chat 123456
[handleStartCommand] WebApp URL: https://dde9f6b1.telegram-study-planner.pages.dev/index.html
[handleStartCommand] Sending message with options: {...}
[TelegramAPI] Sending message to chat 123456
[TelegramAPI] URL: https://api.telegram.org/bot...
[TelegramAPI] Body: {...}
```

### اگر خطا دیدید:

**خطای "Unauthorized" یا "401":**
- TOKEN اشتباه است
- بررسی: `wrangler secret list`

**خطای "Bad Request" یا "400":**
- مشکل در فرمت پیام
- یا chat_id اشتباه است

**خطای "Forbidden" یا "403":**
- ربات بلاک شده
- یا ربات نمی‌تواند به این چت پیام بفرستد

**خطای "Network error":**
- مشکل اتصال به Telegram API

## لطفاً:

1. لاگ‌ها را باز کنید: `wrangler tail`
2. `/start` بفرستید
3. **تمام لاگ‌ها را کپی کنید و بفرستید**

این کمک می‌کند تا ببینم دقیقاً کجا مشکل است!




