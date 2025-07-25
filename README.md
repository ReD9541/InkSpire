# InkSpire

A minimal React Native Expo App with AppWrite to share and complete and share Art challanges.

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).

---

## Features

- Expo-managed React Native app
- Appwrite for
- User authentication (login/register)
- Basic Appwrite database integration

---

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo](https://docs.expo.dev/get-started/installation/)
- An [Appwrite](https://appwrite.io/) instance

---

## Project Structure

```markdown
app/
│
├── _layout.tsx               # Root stack layout 
├── +not-found.tsx           # 404 fallback page
├── index.tsx                # Splash screen (entry point)
├── login.tsx                # Login screen
├── register.tsx             # Registration screen
├── post.tsx                 # Post details screen
│
├── tabs/                    # Tab navigation screens
│   ├── _layout.tsx          # Bottom tab layout
│   ├── create.tsx           # Create post screen
│   ├── index.tsx            # Home Screen
│   ├── profile.tsx          # User profile screen
│   └── settings.tsx         # User settings screen
│
├── app-example/             # (template app structure)
│
├── components/              # Shared reusable components
│   ├── Collapsible.tsx
│   ├── ExternalLink.tsx
│   ├── HapticTab.tsx
│   ├── HelloWave.tsx
│   ├── ParallaxScrollView.tsx
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   └── ui/                  # UI-focused components 
│       ├── ThemedText.tsx
│       ├── ThemedView.tsx
│       └── HapticTab.tsx
│
├── config/                  # Configuration data
│   └── Config.ts
│
├── constants/               # Static constants and data
│   ├── Colors.ts
│   └── prompts.ts
│
├── contexts/                # React context
│
├── hooks/                   # Custom hooks
│   ├── useThemeColor.ts
│   └── useColorScheme.ts
│
├── utils/                   # Utility/helper functions
│   └── validations.ts
│
└── assets/                  # Fonts, images, icons
    ├── fonts/
    │   ├── BagelFatOne-Regular.ttf
    │   ├── RobotoMono-SemiBold.ttf
    │   ├── Sen-VariableFont_wght.ttf
    │   ├── SpaceMono-Regular.ttf
    │   ├── Wittgenstein-Italic-VariableFont_wght.ttf
    │   └── Wittgenstein-VariableFont_wght.ttf
    └── images/
        ├── adaptive-icon.png
        ├── favicon.png
        ├── icon.png
        ├── InkSpire_logo.png
        ├── react-logo@2x.png
        ├── react-logo@3x.png
        ├── splash-icon-dark.png
        └── splash-icon.png
```

## Setup



##  Setup
https://streamable.com/qbtdtw

Copy the config file in a config folder right next to app subfolder
download and extract this |https://drive.google.com/drive/folders/1Wb3Vm1QV7bdrFoa9wtrIK1wPRjcRPYg3?usp=drive_link |

```bash
# 1. Clone the project
git clone https://github.com/ReD9541/InkSpire.git

# 2. Install dependencies
npm install

# 3. Start the Expo app
npx expo start
