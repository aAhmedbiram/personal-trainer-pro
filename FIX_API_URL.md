# 🔧 Fix: Wrong API URL in Vercel

## ❌ المشكلة (The Problem)

الخطأ يظهر:
```
Cannot connect to server at https://personal-trainer-pro.up.railway.app
```

## ✅ الحل (The Solution)

الرابط الصحيح يجب أن يكون:
```
https://personal-trainer-pro-personal-trainer-pro.up.railway.app
```

لاحظ: `personal-trainer-pro-personal-trainer-pro` (مكرر مرتين)

## 📝 الخطوات (Steps)

### 1. اذهب إلى Vercel Environment Variables

افتح:
```
https://vercel.com/ahmedbirams-projects/personal-trainer-pro/settings/environment-variables
```

### 2. ابحث عن `VITE_API_URL`

- إذا كان موجود، اضغط "Edit" (تعديل)
- إذا لم يكن موجود، اضغط "Add New"

### 3. تأكد من القيمة الصحيحة

**القيمة الصحيحة:**
```
https://personal-trainer-pro-personal-trainer-pro.up.railway.app
```

**❌ خطأ (Wrong):**
```
https://personal-trainer-pro.up.railway.app
```

### 4. احفظ وأعد النشر

1. اضغط "Save"
2. اذهب إلى Deployments
3. اضغط "Redeploy" على آخر deployment

## ✅ التحقق (Verification)

بعد إعادة النشر:
1. افتح: `https://personal-trainer-pro.vercel.app/register`
2. اضغط F12 → Console
3. يجب أن ترى:
   ```
   🔗 API URL configured: https://personal-trainer-pro-personal-trainer-pro.up.railway.app
   ```

## 🔍 كيفية معرفة الرابط الصحيح

1. اذهب إلى Railway: https://railway.app
2. افتح مشروعك: `personal-trainer-pro`
3. اضغط على خدمة Backend
4. اذهب إلى Settings → Networking
5. انسخ "Public Domain" - هذا هو الرابط الصحيح



