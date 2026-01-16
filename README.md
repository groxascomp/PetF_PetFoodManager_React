
# 🚀 Getting Started with PetF

PetF is a playful pet automation platform that connects a web app with hardware (NodeMCU/Arduino) and Firebase for authentication and data storage. Follow these steps to run it locally:

---

## 📋 Prerequisites
- Node.js (v16+ recommended)
- npm
- Arduino IDE (with ESP8266 board package installed)
- Firebase account with Firebase (For Services.jsx, line 107)
- Wi‑Fi 2.4 network for your NodeMCU/ESP8266 board (Get the IP from Serial Monitor For NavBar.jsx, line 135 \\ About.jsx, line 120 \\ Level.jsx, line 60)

---

## 🔧 Installation
Before npm run dev
Change the SSD and password on ESP.ino
Make sure the laptop and the ESP connected to same Wifi 2.5 only
After connecting wait on the terminal to show the given IP address
That Ip address will be put on the Jsx code. 
npm run dev
Just find the IP address. On Navbar, level and Tracker.
If all the function working stop the terminal

npm run dev -- --host
copy the Network to your phone






# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



