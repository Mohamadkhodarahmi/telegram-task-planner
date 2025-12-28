# Debug Checklist for Errors

اگر ارور می‌بینید، لطفاً این موارد را چک کنید:

## 1. Console Browser
- F12 را بزنید و به Console بروید
- خطاهای قرمز را پیدا کنید
- پیام خطا را کپی کنید

## 2. Network Tab
- Network tab را باز کنید
- Request های failed (قرمز) را پیدا کنید
- روی آنها کلیک کنید و Response را ببینید

## 3. Worker Logs
اگر در wrangler tail هستید:
- خطاهای stack trace را ببینید
- خطاهای 4xx یا 5xx را پیدا کنید

## مشکلات احتمالی که fix شدند:

1. ✅ Task ID undefined - حالا null check اضافه شده
2. ✅ Task text undefined - fallback اضافه شده  
3. ✅ Migration issues - backend باید migrate کند

## اگر هنوز مشکل دارید:

لطفاً این اطلاعات را بدهید:
- پیام خطای دقیق از Console
- URL که request می‌فرستد
- Status code از Network tab



