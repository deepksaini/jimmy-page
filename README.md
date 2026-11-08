# Jimmy Page

Jimmy Page is a browser guitar course: theory first, then four-bar phrases over A minor, F, G, and A minor. Click the neck or use the keys (C D E G A, Shift+C for the high C, Shift+D for E♭). There is no microphone. Guitar sound uses the acoustic samples in `public/samples/`, and progress is saved on this computer.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (this project uses port 5176).

## Host on Vercel

This is a static Vite app.

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project** and import the repo.
3. Keep the Vite defaults:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy.
