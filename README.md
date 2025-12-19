# 📦 Node.js + Express + TypeScript — Modular Backend Starter Pack

A fully scalable, production-ready **backend starter template** built with **Node.js**, **Express**, and **TypeScript** using a **clean modular architecture**.
Perfect for small to large backend systems following industry best practices.

---

## 🚀 Features

* 🔥 **TypeScript support**
* 📁 **Modular folder structure** (Controller, Service, Route, Validation)
* 🌐 **Express server** with CORS
* 🧩 **Reusable utilities** (catchAsync, sendResponse)
* 🛠️ **Easy environment configuration**
* 📦 **Production build support**
* 🚦 Clean, maintainable, readable code

---

## 📂 Project Structure

```
src/
 ├── app/
 │   ├── modules/
 │   ├── app.ts
 │
 ├── utils/
 │   ├── catchAsync.ts
 │   ├── sendResponse.ts
 │
 ├── config
 ├── app.ts
 ├── server.ts
 ├── .env
```

---

## 🛠️ Installation & Setup

### **1️⃣ Clone the project**

```bash
git clone https://github.com/nayeem-miah/Backend-api.git
cd Backend-api
```

---

### **2️⃣ Install dependencies**

```bash
npm install
```

---

### **3️⃣ Create `.env` file**

```
PORT=5000
```

---

### **4️⃣ Start development server**

```bash
npm run dev
```

---

### **5️⃣ Build for production**

```bash
npm run build
```

---

### **6️⃣ Start production server**

```bash
npm start
```

---

## 📘 Scripts (package.json)

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

## 🤝 Contributing

Contributions are welcome!
Feel free to open issues or submit pull requests.

---

## 📄 License

This project is licensed under the **MIT License**.

---

