# Native iOS app — install on your iPhone (personal, not App Store)

This wraps the PWA in a Capacitor iOS shell. It builds and launches (verified in the
simulator). Getting it onto your phone is a manual Xcode + TestFlight flow — only you
can do the Apple-signing parts. Do these steps once; after that, updates are quick.

## One-time setup

### 1. Apple Developer account ($99/yr)
- Go to [developer.apple.com/programs](https://developer.apple.com/programs/) → Enroll.
- Use your Apple ID; pay the $99. Approval is usually within a day.
- Accept the agreement in [App Store Connect](https://appstoreconnect.apple.com).

### 2. Open the project in Xcode
```bash
cd "/Users/floydrocker/Library/Mobile Documents/com~apple~CloudDocs/Leica App"
npm run sync          # copies web files into dist/ + syncs to iOS
open ios/App/App.xcworkspace     # MUST open the .xcworkspace, not the .xcodeproj
```

### 3. Set signing
- In Xcode, select the **App** target (left sidebar, top) → **Signing & Capabilities** tab.
- Tick **Automatically manage signing**.
- **Team:** choose your developer team (appears after step 1).
- Bundle Identifier: `app.floydrocker.leicam11` (already set). If Xcode complains, change
  it to something unique to you, e.g. `app.floydrocker.leicam11v2`.

## Install on your phone via TestFlight

1. **Plug your iPhone into the Mac** (or select it over Wi-Fi after first pairing).
2. In Xcode's destination bar (top), select **Any iOS Device (arm64)** — needed for archiving.
3. **Product → Archive** (waits while it builds a release archive).
4. Organizer opens → select the archive → **Distribute App → App Store Connect → Upload**
   (keep defaults, let it upload).
5. In [App Store Connect](https://appstoreconnect.apple.com): **My Apps → + → New App**.
   Platform **iOS**, name **M11 Monochrom**, Primary Language, Bundle ID
   `app.floydrocker.leicam11`, SKU anything (e.g. `leicam11`). Create.
6. Under the app → **TestFlight** tab. Your uploaded build appears within a few minutes
   (processing). No review needed for **internal testing** — add yourself as an internal
   tester (TestFlight → Internal → add your Apple ID).
7. On your iPhone, install the **TestFlight** app (App Store). Open the TestFlight invite
   (emailed, or open TestFlight → it shows your app). Tap **Install**.

You now have a real app icon on your home screen — launches full-screen, offline, haptics
on lens/theme taps. It lasts 90 days per build; rebuild + re-upload to refresh.

## Updates (when content changes)

When you (or Claude) edit the web files (lenses, settings, etc.):

```bash
cd "/Users/floydrocker/Library/Mobile Documents/com~apple~CloudDocs/Leica App"
npm run sync
open ios/App/App.xcworkspace    # then Archive → Distribute → Upload, as above
```

TestFlight auto-offers the update; one tap installs it. No review, no App Store listing.
Internal TestFlight builds don't go through review.

## Notes / gotchas

- **Always open `App.xcworkspace`**, not `App.xcodeproj` — the workspace includes the
  CocoaPods integration. The plain project won't build.
- **Locale:** if `pod install` ever fails with a Unicode/encoding error, run it with
  `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 pod install` inside `ios/App/`. Xcode's own builds
  are unaffected once Pods are installed.
- **iCloud path:** the project lives in an iCloud-synced folder. That's fine for source,
  but if Xcode acts strangely (stale builds), move the whole folder out of iCloud to
  `~/Developer/leica-m11-ref` and work there. Build output is already gitignored.
- **Live updates (optional, later):** Capacitor Updater can push JS-only content changes
  straight to the installed app without re-archiving — so editing a lens setting ships in
  seconds, no Xcode. Ask to set this up once the basic install works.