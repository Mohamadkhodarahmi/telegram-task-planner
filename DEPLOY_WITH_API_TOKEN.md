# راهنمای Deploy با API Token

## مشکل OAuth:
خطای `EACCES: permission denied` به این معنی است که wrangler نمی‌تواند روی پورت 8976 گوش دهد.

## راه حل: استفاده از API Token

### 1. ایجاد API Token در Cloudflare:

1. بروید به: https://dash.cloudflare.com/profile/api-tokens
2. روی "Create Token" کلیک کنید
3. از "Edit Cloudflare Workers" template استفاده کنید
4. یا دستی تنظیم کنید:
   - **Permissions:**
     - Account: Workers Scripts: Edit
     - Account: Workers KV Storage: Edit
     - Account: Workers Routes: Edit
     - Account: Workers Tail: Read
     - Account: D1: Edit
     - Account: Pages: Edit
   - **Account Resources:** همه حساب‌ها یا حساب خاص
5. روی "Continue to summary" کلیک کنید
6. روی "Create Token" کلیک کنید
7. **Token را کپی کنید** (فقط یک بار نمایش داده می‌شود!)

### 2. تنظیم Token در PowerShell:

```powershell
# برای این session
$env:CLOUDFLARE_API_TOKEN="your-token-here"

# یا برای همیشه (User Environment Variable)
[System.Environment]::SetEnvironmentVariable('CLOUDFLARE_API_TOKEN', 'your-token-here', 'User')
```

### 3. Deploy:

```powershell
# Deploy Pages
wrangler pages deploy public --project-name=telegram-study-planner

# Deploy Worker
wrangler deploy
```

---

## روش جایگزین: استفاده از wrangler login

اگر می‌خواهید از OAuth استفاده کنید:

1. PowerShell را به عنوان Administrator اجرا کنید
2. یا از port دیگری استفاده کنید (اما wrangler این را پشتیبانی نمی‌کند)

**بهترین راه:** استفاده از API Token است.

---

## بررسی Token:

```powershell
# بررسی اینکه token تنظیم شده
echo $env:CLOUDFLARE_API_TOKEN
```

---

## نکات مهم:

- ✅ API Token امن‌تر است
- ✅ نیازی به browser نیست
- ✅ برای CI/CD مناسب است
- ⚠️ Token را در `.gitignore` نگه دارید
- ⚠️ Token را به کسی ندهید

---

## اگر هنوز مشکل دارید:

1. بررسی کنید که token درست کپی شده
2. بررسی کنید که permissions درست است
3. بررسی کنید که account درست است
4. دوباره token بسازید



