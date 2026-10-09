# 🇮🇳 GST Calculator India (2026+ Compliant)

A modern, fast, and feature-packed Goods & Services Tax (GST) Calculator web application designed for India's 2026+ tax structure. Built with zero complex framework dependencies (pure static HTML5, Tailwind CSS, Lucide/FontAwesome icons & Chart.js) so it deploys natively and instantly to **GitHub Pages** and **Vercel**.

---

## 🌟 Key Features

* **🇮🇳 2026+ Tax Slab Support**: Pre-configured with updated Indian tax slabs:
  * **0% (Nil)**: Essential foods, medicines, exempted health/life insurance.
  * **3% (Gold)**: Precious metals & jewellery.
  * **5% (Merit Rate)**: Everyday consumer staples, packaged foods.
  * **12% / 18% (Standard Rate)**: Electronics, IT services, general appliances.
  * **28% / 40% (Sin/Luxury Rate)**: Aerated drinks, tobacco, luxury vehicles, >350cc bikes, online gaming.
  * **Custom %**: Enter any custom GST rate decimal.
* **🔄 Exclusive & Inclusive Modes**:
  * **Exclusive (+ GST)**: Adds GST on top of taxable net base price.
  * **Inclusive (- GST)**: Extracts base price and GST tax component from gross total.
* **🏢 Intra-State vs Inter-State Breakdown**:
  * **Intra-State**: Calculates equal split of **CGST** (Central GST) + **SGST** (State GST).
  * **Inter-State**: Calculates full **IGST** (Integrated GST).
* **🧾 Multi-Item Invoice Builder**: Add multiple products or services with unit price, quantity, individual tax rates, and tax type to calculate total invoice value.
* **🔍 HSN / SAC Rate Finder**: Built-in searchable lookup database for official Goods and Services Accounting codes and their GST slabs.
* **📊 Visual Chart & Formula Guide**: Live Doughnut chart visualization of Net Price vs Tax component and step-by-step mathematical calculation formulas.
* **🖨️ PDF & Print Invoice Export**: One-click printable layout and plain text clipboard summary exporter for WhatsApp & email sharing.
* **🌙 Dark / Light Mode**: Theme switch with local persistence.

---

## 🚀 How to Deploy

### Option 1: Deploying to GitHub Pages (Free)

1. Create a new repository on [GitHub](https://github.com/new).
2. Push all project files into your repository's `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - GST Calculator 2026+"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/gst-calculator.git
   git push -u origin main
   ```
3. On GitHub, go to your repository **Settings** > **Pages**.
4. Under **Source**, select **GitHub Actions** (or `Deploy from a branch` -> select `main` and `/root`).
5. Click **Save**. Your site will automatically build and publish at:
   `https://YOUR_USERNAME.github.io/gst-calculator/`

---

### Option 2: Deploying to Vercel (1-Click)

#### Method A: Via GitHub Integration
1. Push your code to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **Import Repository** and select your `gst-calculator` repo.
4. Keep framework preset as **Other** (Static Site).
5. Click **Deploy**. Vercel will instantly issue a production `.vercel.app` URL.

#### Method B: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 💻 Local Testing / Running

Since this project uses pure static web standards, you can view it directly without any build process:
1. Double-click `index.html` in any web browser, OR
2. Use Python's built-in HTTP server:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

---

## 📁 Project Structure

```
gst-calculator/
├── index.html        # Main HTML layout & application structure
├── styles.css        # Custom styles, dark mode overrides & print rules
├── app.js            # Main GST engine, multi-item invoice math & UI state
├── hsn_data.js       # HSN & SAC codes master database
├── vercel.json       # Vercel deployment & caching configuration
├── README.md         # Documentation & deployment guide
└── .github/
    └── workflows/
        └── static.yml # GitHub Actions automated Pages deployment
```

---

## 📜 Tax Disclaimer

*This GST Calculator provides estimates based on standard Indian Goods and Services Tax guidelines for 2026 and onwards. For official tax filings and GST returns, please consult a certified Chartered Accountant (CA) or reference the official Central Board of Indirect Taxes and Customs (CBIC) portal.*
