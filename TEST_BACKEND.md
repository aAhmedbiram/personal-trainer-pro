# اختبار الـ Backend

## الخطوة 1: تحقق من أن الـ Backend يعمل

افتح في المتصفح:
```
https://personal-trainer-pro-personal-trainer-pro.up.railway.app/
```

**يجب أن ترى:**
```json
{
  "message": "Personal Trainer Pro API",
  "status": "running",
  ...
}
```

**إذا رأيت خطأ أو صفحة فارغة:**
- الـ backend لا يعمل على Railway
- تحقق من Railway logs
- تأكد من أن الـ deployment نجح

## الخطوة 2: تحقق من Railway Deployment

1. اذهب إلى Railway: https://railway.app
2. افتح مشروعك: `personal-trainer-pro`
3. اضغط على خدمة Backend
4. اذهب إلى "Deployments" tab
5. تأكد من أن آخر deployment نجح (✅ green checkmark)
6. إذا كان فاشل، اضغط "View logs" وابحث عن الأخطاء

## الخطوة 3: تحقق من Environment Variables في Railway

1. في Railway → خدمة Backend → "Variables" tab
2. تأكد من وجود:
   - `DATABASE_URL` (يجب أن يكون موجود تلقائياً من Postgres)
   - `SECRET_KEY` (يجب أن يكون موجود)
   - `JWT_SECRET_KEY` (يجب أن يكون موجود)
   - `FLASK_ENV=production` (اختياري لكن مفيد)

## الخطوة 4: تحقق من Postgres

1. في Railway → خدمة Postgres
2. تأكد من أنها تعمل (✅ green checkmark)
3. إذا كانت متوقفة، أعد تشغيلها

## الخطوة 5: بعد التأكد من كل شيء

1. انتظر حتى ينتهي النشر الجديد (1-2 دقيقة)
2. افتح Incognito Mode: `Ctrl + Shift + N`
3. افتح: `https://personal-trainer-pro.vercel.app/register`
4. جرب التسجيل

## إذا ما زال لا يعمل

أرسل لي:
1. ماذا ترى عند فتح `https://personal-trainer-pro-personal-trainer-pro.up.railway.app/`؟
2. Railway deployment logs (آخر deployment)
3. Console errors من المتصفح (F12)

