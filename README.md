# VXNOIR MUSIC 🎵

Ultra Premium Futuristic Music Streaming App

## Developed by
**ANOOP KUMAR DUBEY** · @anoop_.exe · VXNOIR Brand

---

## Tech Stack
- React 18 + Vite 5
- Framer Motion (animations)
- React Router DOM (routing)
- Howler.js (audio)
- PWA Support

## Music APIs
- **Audius** — Free, real streaming tracks
- **iTunes** — 30s previews
- **Jamendo** — Full tracks (CC licensed)

## Setup

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Deploy to Netlify

1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Done!

Or drag the `dist/` folder to Netlify Drop.

## APK via Capacitor

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init VXNOIR com.vxnoir.music
npm run build
npx cap add android
npx cap sync
npx cap open android
```

Then build APK in Android Studio.

## Features
- Real music streaming (Audius, Jamendo, iTunes)
- Global search across all APIs
- Fullscreen player with seek, volume, repeat, shuffle
- Queue system
- Liked songs & playlists
- Recently played
- Mood-based discovery
- Onboarding with name & gender
- PWA installable
- Mobile-first responsive design
- Cyberpunk glassmorphism UI
- Neon glow effects + animations

## License
Crafted with ❤️ by ANOOP KUMAR DUBEY · VXNOIR
