# Rinvio 🧗‍♂️

Rinvio is a mobile application for climbers to track their outdoor and indoor ascents. Built with React Native and Expo, it allows you to keep a personal log of your climbing progression directly on your device.

## ✨ Features

- **Climb Logging**: Record the name, grade, sector, and style (Lead, Top Rope, Boulder) of your climbs.
- **SQLite Storage**: All data is stored locally on your device. Your data stays yours.
- **Statistics**: View a summary of your activities and progression.
- **Export/Import**: easily backup your database or move it to another device via JSON/SQLite export.
- **Multilingual Support**: Fully localized in English and Italian.
- **Dark Mode**: High-contrast UI designed for both indoor gyms and outdoor crags.

## 🚀 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Database**: [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone [https://github.com/6eero/rinvio.git](https://github.com/6eero/rinvio.git)
   cd rinvio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

You can then open the app on your physical device via the **Expo Go** app by scanning the QR code, or run it on an emulator.

## 🛠️ Building for Android (APK)

This project is configured for [EAS Build](https://docs.expo.dev/build/introduction/). To generate an APK:

1. Install EAS CLI: `npm install -g eas-cli`
2. Run: `eas build -p android --profile preview`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_Developed with ❤️ for the climbing community._
