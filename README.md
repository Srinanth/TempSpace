# TempSpace

![TempSpace Banner](/client/public/TempSpaceLogo.png)

> **Share files instantly, without a trace.**  
> A fast, privacy-focused, ephemeral file-sharing platform built for simplicity.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React_19-61DAFB.svg?logo=react)
![Tailwind](https://img.shields.io/badge/styling-Tailwind_CSS-38B2AC.svg?logo=tailwind-css)
![Status](https://img.shields.io/badge/status-Active-success.svg)

---

## 📖 About

**TempSpace** is a temporary file-sharing web application designed for quick, frictionless collaboration. Unlike traditional cloud storage platforms, TempSpace does **not require user accounts** and does **not store files permanently**.

Users can create a temporary “Space,” upload files, and share access using a short code. Each space is automatically deleted after a fixed time window or manually destroyed by the creator.

This makes TempSpace ideal for:
- Quick peer-to-peer file sharing
- Temporary project collaboration
- Sharing sensitive files without long-term storage

---

## ✨ Key Features

### 🔒 Privacy-Focused by Design
- **No Account Required:** Anonymous usage with no sign-ups.
- **Ephemeral Spaces:** Files and metadata are automatically removed after expiration.
- **Minimal Data Retention:** Only essential session data is stored temporarily.

### 🍪 Cookie-Free Sessions
- **No Tracking Cookies:** No analytics or ad trackers.
- **Local Storage–Based Sessions:** Lightweight client-side session persistence.
- **Token-Based Access:** Secure access tokens handled via custom React hooks.

### ⚡ User Experience
- **Real-Time Feedback:** Upload progress and space activity updates.
- **Dark & Light Mode:** System-aware theming with persistence.
- **Responsive UI:** Mobile-first layout with a clean, modern glassmorphism design.
- **Admin Controls:** Space creators can manage files, users, and access settings.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** (Vite)
- **React Router DOM**
- **Tailwind CSS**
- **Lucide React** (Icons)
- **React Context API**
- **Custom Hooks**
- **Axios**
- **React Hot Toast**

### Backend
- **TypeScript**
- **Node.js**
- **Express.js**
- **Supabase** (File Storage & DB)

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18 or higher**
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Srinanth/TempSpace.git
cd TempSpace
```

2. **Install dependencies for the Frontend**
```bash
cd client
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

4. **Run the development server**
```bash
npm run dev
```

The application will be available at:
```
http://localhost:5173

```
5. **Install dependencies for Backend**
```bash
cd server
npm install && npm run build
```
6. **Configure environment variables**

Create a `.env` file in the root directory:
```env
keyname=your_key
```
7. **Run the development server**
```bash
npm start
```

## 🛡️ Usage Policy

TempSpace is intended strictly for **legal, ethical, and responsible file sharing**.

### Prohibited Uses

❌ **Piracy**  
Uploading or sharing copyrighted software, movies, music, or other media without proper authorization is strictly prohibited.

❌ **Malware & Exploits**  
Uploading malicious files, viruses, ransomware, or attempting to exploit the platform is not allowed.

❌ **Illegal Content**  
Any form of illegal content, including but not limited to copyrighted leaks, abusive material, or prohibited data, will result in immediate access termination.

TempSpace reserves the right to remove content and restrict access if misuse is detected.

---

## 🤝 Contributing

Contributions are welcome and encouraged.

### How to Contribute

1. **Fork the repository**

2. **Create a feature branch**
```bash
git checkout -b feature/YourFeature
```

3. **Make your changes**
- Follow existing code style and conventions
- Keep commits focused and meaningful

4. **Commit your changes**
```bash
git commit -m "feat: add YourFeature"
```

5. **Push to your branch**
```bash
git push origin feature/YourFeature
```

6. **Open a Pull Request**
- Clearly describe what your change does
- Reference related issues if applicable

### Contribution Guidelines
- Write clean, readable code
- Avoid introducing breaking changes without discussion
- Test your changes before submitting

All contributions are reviewed before merging.


## 📄 License
Distributed under the MIT License. See ![LICENSE](/LICENSE) for more information.

