<div align="center">
  <img src="https://img.icons8.com/color/96/000000/pinterest--v1.png" alt="Pinterest Downloader Logo" width="80" />

  # Pinterest Image Downloader

  <p>
    <strong>A lightweight, elegant, and blazing fast web application to batch download high-definition images from Pinterest.</strong>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#prerequisites">Prerequisites</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#usage">Usage</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#contributing">Contributing</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" />
    <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" />
  </p>
</div>

---

## ✨ Features

- **Batch Downloading**: Paste multiple Pinterest URLs (one per line) and download them all at once.
- **High-Definition Resolution**: Automatically extracts and downloads the original, highest-quality version (`/originals/`) of the image.
- **Direct to Local Folder**: Uses the modern [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) to save files directly to your chosen local directory without annoying browser prompts.
- **CORS Bypass**: Built-in API proxy to bypass cross-origin restrictions elegantly.
- **Minimalist UI**: A clean, flat-design interface built with Tailwind CSS.
- **Real-time Progress**: Visual indicators for parsing, downloading, and completion status of each image.

## 🚀 Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js** (v18.0.0 or newer)
- **npm** / **yarn** / **pnpm** / **bun**
- A modern Chromium-based browser (Chrome, Edge) to support the `showDirectoryPicker` API for direct local saving.

## 🛠️ Getting Started

Follow these steps to set up the project locally.

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pinterest-downloader.git
   cd pinterest-downloader
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or yarn dev / pnpm dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1. Click the **"Select Output Folder"** button and grant the browser permission to write to your chosen local directory.
2. Paste your Pinterest URLs into the text area. You can use direct Pin URLs (e.g., `https://www.pinterest.com/pin/123456789/`) or short links (e.g., `https://pin.it/...`).
3. Click **"Download All"**.
4. Watch the progress list below as your high-definition images are securely saved to your local machine!

## 🏗️ Architecture

This project is built with modern web technologies:

- **Frontend**: [Next.js](https://nextjs.org/) App Router with React Server Components.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first, responsive design.
- **Icons**: [Lucide React](https://lucide.dev/) for beautiful, crisp SVG icons.
- **DOM Parsing**: [Cheerio](https://cheerio.js.org/) (Server-side) for lightning-fast HTML parsing to extract `og:image` tags.
- **File System**: `window.showDirectoryPicker()` to create writable file streams directly on the user's disk.

### How it works
1. **Frontend** sends a Pin URL to the `/api/parse` route.
2. **Backend** fetches the Pinterest page, parses the DOM, finds the image, and upgrades the URL to the `/originals/` resolution.
3. **Frontend** sends the high-res image URL to the `/api/proxy` route.
4. **Backend** fetches the image buffer from Pinterest servers and streams it back to the client with appropriate CORS headers.
5. **Frontend** receives the Blob and writes it to the local disk.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) file for detailed guidelines.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Made with ❤️ for the open-source community.
</div>
