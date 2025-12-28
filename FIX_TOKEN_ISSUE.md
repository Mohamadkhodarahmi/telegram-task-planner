# مشکل پیدا شد! TOKEN تنظیم نشده است

## مشکل:
در لاگ می‌بینیم:
```
URL: https://api.telegram.org/botundefined/sendMessage
```

یعنی `env.TOKEN` مقدار ندارد (undefined است).

## راه حل:

TOKEN باید به عنوان **secret** تنظیم شود، نه در `wrangler.toml`.

### مرحله 1: تنظیم TOKEN

```bash
wrangler secret put TOKEN
```

وقتی از شما خواست، token ربات خود را از @BotFather وارد کنید:
```
<YOUR_BOT_TOKEN>
```

### مرحله 2: بررسی

برای بررسی که TOKEN تنظیم شده:
```bash
wrangler secret list
```

باید TOKEN را در لیست ببینید.

### مرحله 3: Redeploy

بعد از تنظیم TOKEN:
```bash
wrangler deploy
```

### مرحله 4: تست

1. در تلگرام `/start` بفرستید
2. باید پاسخ بگیرید! 🎉

## تفاوت بین vars و secrets:

- **vars** (در wrangler.toml): برای مقادیر غیر حساس مثل SECRET و URL
- **secrets** (با wrangler secret put): برای مقادیر حساس مثل TOKEN

TOKEN نباید در wrangler.toml باشد چون امن نیست!

## خلاصه:

1. ✅ `wrangler secret put TOKEN` - token را وارد کنید
2. ✅ `wrangler deploy` - worker را deploy کنید
3. ✅ `/start` بفرستید - باید کار کند!




