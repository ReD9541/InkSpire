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

##  Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo](https://docs.expo.dev/get-started/installation/)
- An [Appwrite](https://appwrite.io/) instance 

---

# Project Structure

```markdown

app/
│
├── _layout.tsx               # Root layout (includes stack + tabs)
├── index.tsx                 # Splash screen (default route)
├── landing.tsx               # Splash landing screen
├── login.tsx                 # Sign In screen
├── register.tsx              # Sign Up screen
│
├── post.tsx                  # Post detail screen 
│
├── tabs/                     # Tab-based navigation routes
│   ├── _layout.tsx           # Tab layout (bottom tab navigator)
│   ├── home.tsx              # Home screen (prompts + feed)
│   ├── create.tsx            # Create Post screen
│   ├── profile.tsx           # Profile screen
│   └── settings.tsx          # Settings screen
│
├── components/              # Shared, reusable components
│   ├── PostCard.tsx         # UI for post previews
│   ├── PromptCard.tsx       # UI for today's prompt
│   ├── ChallengeCarousel.tsx# Monthly challenge scroller
│   ├── ProfileImage.tsx     # Reusable profile image
│   ├── Button.tsx           # Reusable button
│   ├── InputField.tsx       # Reusable input field
│   └── ui/                  # Additional shared UI elements
│       ├── ThemedText.tsx
│       ├── ThemedView.tsx
│       └── HapticTab.tsx    # (or similar enhancements)
│
├── constants/               # Static data/constants
│   ├── Colors.ts            # Theme colors
│   └── prompts.ts           # Monthly challenge names, example prompts
│
├── hooks/                   # Custom React hooks
│   ├── useThemeColor.ts     # Hook for theme colors
│   └── useColorScheme.ts    # Light/dark mode
│
├── utils/                   # Utility/helper functions
│   └── validations.ts       # Form validation logic
│
└── assets/                  # Fonts, images, SVGs, etc.

```


##  Setup

```bash
# 1. Clone the project
git clone https://github.com/ReD9541/InkSpire.git
cd inkspire

# 2. Install dependencies
npm install

# 3. Start the Expo app
npx expo start
