# InkSpire

A minimal React Native Expo application integrated with Appwrite for creating, sharing, and completing art challenges.

Includes custom design touches like **linear gradients**, **custom icon styles**, and **dark‑mode friendly colors** for a modern, visually appealing experience.

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals or explore advanced topics with [guides](https://docs.expo.dev/guides).

---

## Demo

- **Android** [Android App Demo](https://youtu.be/NnPIsXiOyio)
- **iOS** [iOS App Demo](https://youtube.com/shorts/cy7ta0EKUjE?feature=share)

---

## Demo

* **Android**  [Android App Demo](https://youtu.be/NnPIsXiOyio)
* **iOS**  [iOS App Demo](https://youtube.com/shorts/cy7ta0EKUjE?feature=share)

---

## Features

- Participate in art challenges directly from your device using a clean, mobile‑first interface.
- Create an account or log in securely using Appwrite authentication.
- Browse, view, and interact with posts and challenges stored in the Appwrite database.
- Post your own art challenges with titles, descriptions, and images.
- Enjoy a responsive interface with a modular component and context structure for fast navigation.

---

## Design Elements & UI Patterns

### Color & Tokens

Defines consistent color usage for accent, surface, text, and feedback states.

### Linear Gradients

Implemented using `expo-linear-gradient` to add depth to headers, media overlays, and sections.

### Cards & Elevation

Dark‑mode friendly card designs with subtle borders and radius, avoiding heavy shadows.

### Iconography & Actions

Action icons (Ionicons) sized for clarity, with vertical stacking for secondary actions like delete.

### Typography

Clear hierarchy with title and body font sizes, tuned for legibility.

### SafeAreaView

The `SafeAreaView` from `react-native-safe-area-context` ensures content isn’t obscured by device notches, home indicators, or status bars. Used across screens to wrap UI safely within viewable bounds.

**Example:**

```tsx
import { SafeAreaView } from "react-native-safe-area-context";
<SafeAreaView style={{ flex: 1 }}> ... </SafeAreaView>;
```

### Keyboard Handling

Screens with input fields use `KeyboardAvoidingView` and `ScrollView` to prevent the keyboard from overlapping text inputs.

**Example:**

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
  {...}
</KeyboardAvoidingView>
```

---

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An [Appwrite](https://appwrite.io/) instance

---

## Project Structure

```markdown
app/
│
├── \_layout.tsx # Root stack layout
├── +not-found.tsx # 404 fallback page
├── index.tsx # Splash screen (entry point)
├── login.tsx # Login screen
├── register.tsx # Registration screen
├── post/[id].tsx # Post details screen
├── challenge/[id].tsx # Challenge details screen
├── settings.tsx # Settings screen
│
├── (tabs)/ # Tab navigation screens
│ ├── \_layout.tsx # Bottom tab layout
│ ├── create.tsx # Create post screen
│ ├── index.tsx # Home screen
│ └── profile.tsx # User profile screen
│
├── components/ # Shared reusable components
├── config/ # Configuration data
├── constants/ # Static constants
├── contexts/ # React contexts
├── hooks/ # Custom hooks
├── utils/ # Utility functions
└── assets/ # Fonts, images, icons
```

---

## Setup

1. **Clone the repository**

```bash
git clone https://github.com/ReD9541/InkSpire.git
```

2. **Install dependencies**

```bash
npm install
```

3. **Configuration**

- Copy `Config.ts` into the `config/` folder (sibling to `app/`).
- If you are following the setup video: [Demo Video](https://streamable.com/qbtdtw)
- Config bundle: [Config Google Drive](https://drive.google.com/drive/folders/1Wb3Vm1QV7bdrFoa9wtrIK1wPRjcRPYg3?usp=drive_link)

4. **Start the application**

```bash
npx expo start
```

---

## Key Functions & Modules

- `utils/helper.ts` – Validation and formatting helpers.
- `hooks/useThemeColor.ts` – Themed color resolution.
- `hooks/useColorScheme.ts` – Detects system color scheme.
- `lib/appwrite.ts` – Appwrite account and data operations.
- `contexts/AppwriteConn.ts` – Appwrite client configuration.
- `contexts/AuthContext.ts` – Authentication state management.
