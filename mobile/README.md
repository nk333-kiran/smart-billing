# PocketPOS — Mobile App (Expo / React Native)

Native Android POS client that reuses the existing `backend/` (Express + MongoDB).
Same auth, products, customers, and bills APIs as the web app.

## What's here now

- Auth (login) with secure token storage (`expo-secure-store`)
- Billing (POS) screen: product search, cart, 18% GST, Generate Bill
- Bills history screen (pull to refresh)
- Bottom-tab navigation with an auth gate

## Prerequisites

- Node 18+ (you have Node 20)
- No Android SDK is required if you build APKs in the cloud with **EAS** (recommended on Windows).
  Local builds/emulator require Android Studio + SDK + `ANDROID_HOME`.

## Install

```bash
cd mobile
npm install
```

## Run in development

1. Start the backend first (from `backend/`): `npm run dev` (listens on :5000).
2. Start Expo: `npm start`
3. Open on a device with **Expo Go** (scan QR) or an Android emulator.

### API URL — important

`app.json` sets `extra.apiUrl`. Defaults to `http://10.0.2.2:5000`:

- `10.0.2.2` = the Android **emulator's** alias for your computer's `localhost`.
- On a **physical phone** (Expo Go), change it to your PC's LAN IP, e.g. `http://192.168.1.20:5000`, and make sure the phone and PC are on the same Wi-Fi.
- The backend uses `cors()` already, so cross-origin requests are allowed.

## Build an installable APK (no local Android SDK needed)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --profile preview --platform android
```

EAS builds in the cloud and returns a downloadable APK link.

## Not yet implemented (next steps)

These were in the mobile roadmap and are **not** in this scaffold yet — they need native
modules and a custom dev build (they don't run in plain Expo Go):

- Camera barcode scanner (`expo-camera` has a barcode scanner; or `react-native-vision-camera`)
- Bluetooth thermal (ESC/POS) printing — needs a native BLE/ESC-POS module + custom dev build
- Offline billing + sync (local queue via AsyncStorage/SQLite, replay on reconnect)
- Reports and Settings screens
