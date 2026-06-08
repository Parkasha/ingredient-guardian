# 🛡️ Ingredient Guardian

AI-powered ingredient safety analysis. Scan food, cosmetics, medicines & more.

---

## 🚀 Deploy to Vercel (free) — Step by Step

### Step 1 — Push to GitHub

1. Create a free account at [github.com](https://github.com) if you don't have one
2. Create a **New Repository** (name it `ingredient-guardian`, set to Public)
3. Upload all files from this zip — drag them into the GitHub web interface, or use:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ingredient-guardian.git
   git push -u origin main
   ```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up free (use your GitHub account)
2. Click **"Add New Project"**
3. Click **"Import"** next to your `ingredient-guardian` repo
4. Vercel auto-detects React — just click **"Deploy"**

### Step 3 — Add your Anthropic API Key (required)

1. Get a free API key at [console.anthropic.com](https://console.anthropic.com)
2. In Vercel dashboard → Your project → **Settings** → **Environment Variables**
3. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (your key)
   - **Environment:** Production, Preview, Development ✓
4. Click **Save**, then go to **Deployments** → click **Redeploy**

✅ Your app is live! Vercel gives you a free URL like `ingredient-guardian.vercel.app`

---

## 💻 Run Locally

```bash
# Install dependencies
npm install

# Add your API key
echo "ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE" > .env.local

# Start dev server
npm start
```

The app opens at http://localhost:3000. The `/api/analyze` proxy works locally too via `react-scripts`.

---

## 🔒 How the API Key is kept secure

Your key lives **only** in Vercel's environment variables — never in the browser.

```
Browser → POST /api/analyze → Vercel serverless (api/analyze.js) → Anthropic API
                               ↑ API key injected here server-side
```

The file `api/analyze.js` is the secure proxy. Users never see your key.

---

## 🛠 Tech Stack

- React 18 + vanilla CSS
- Vercel Serverless Functions (Node.js)
- Anthropic Claude API (claude-sonnet-4-20250514)
- Google Fonts: Syne + DM Sans
