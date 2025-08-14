# InkSpire

A minimal React Native Expo application integrated with Appwrite for creating, sharing, and completing art challenges.

* [Expo documentation](https://docs.expo.dev/): Learn fundamentals or explore advanced topics with [guides](https://docs.expo.dev/guides).

---

## Features

* Participate in art challenges directly from your device using a clean, mobile‑first interface.

* Create an account or log in securely using Appwrite authentication.

* Browse, view, and interact with posts and challenges stored in the Appwrite database.

* Post your own art challenges with titles, descriptions, and  images.

* Enjoy a responsive interface with a modular component and context structure for fast navigation.



## Prerequisites

* [Node.js](https://nodejs.org/)
* [Expo CLI](https://docs.expo.dev/get-started/installation/)
* An [Appwrite](https://appwrite.io/) instance

---

## Project Structure

```markdown
app/
│
├── _layout.tsx               # Root stack layout
├── +not-found.tsx            # 404 fallback page
├── index.tsx                 # Splash screen (entry point)
├── login.tsx                  # Login screen
├── register.tsx               # Registration screen
├── post/[id].tsx              # Post details screen
├── challenge/[id].tsx         # Challenge details screen
├── settings.tsx               # Settings screen
│
├── (tabs)/                    # Tab navigation screens
│   ├── _layout.tsx            # Bottom tab layout
│   ├── create.tsx             # Create post screen
│   ├── index.tsx              # Home screen
│   └── profile.tsx            # User profile screen
│
├── components/                # Shared reusable components
├── config/                     # Configuration data
├── constants/                  # Static constants
├── contexts/                   # React contexts
├── hooks/                      # Custom hooks
├── utils/                      # Utility functions
└── assets/                     # Fonts, images, icons
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

   * Copy `Config.ts` into the `config/` folder (sibling to `app/`).
   * If you are following the setup video: [Demo Video](https://streamable.com/qbtdtw)
   * config bundle : [Config Google Drive](https://drive.google.com/drive/folders/1Wb3Vm1QV7bdrFoa9wtrIK1wPRjcRPYg3?usp=drive_link)

4. **Start the application**

   ```bash
   npx expo start
   ```

---

## Key Functions & Modules

> The following summarizes important functions used across the project and how they behave. 

### 1) `utils/helper.ts`

* **`validateEmail(email: string): boolean`**
  Validates that `email` matches a standard pattern (`username@domain.tld`). Intended as a *client‑side* check before making registration/login requests, minimizing unnecessary network calls with malformed inputs.

* **`validatePassword(password: string): boolean`**
  Ensures a minimum level of password complexity (e.g., length threshold and optional character‑class checks). 

* **`capitalizeFirstLetter(text: string): string`**
  Returns `text` with the first character capitalized.

**Usage example**

```ts
import { validateEmail, validatePassword, capitalizeFirstLetter } from "@/utils/helper";

if (!validateEmail(form.email)) {
  setError("Please enter a valid email address.");
}

if (!validatePassword(form.password)) {
  setError("Password does not meet minimum requirements.");
}

const title = capitalizeFirstLetter(form.title);
```

---

### 2) `hooks/useThemeColor.ts`

* **`useThemeColor(props, colorName)`**
  Returns a themed color string. It resolves in the following order: explicit override in `props` → color from the current scheme (light/dark) → default palette. This guarantees consistent theming even when the device toggles between light and dark modes.

**Usage example**

```tsx
const tint = useThemeColor({}, "tint");
return <View style={{ borderColor: tint }} />;
```

---

### 3) `hooks/useColorScheme.ts`

* **`useColorScheme()`**
  Determines the current system color scheme (`"light" | "dark"`) and re‑renders components when it changes. Components can read this value to switch styles without additional plumbing.

**Usage example**

```tsx
const scheme = useColorScheme();
const background = scheme === "dark" ? "#0b0b0b" : "#ffffff";
return <View style={{ backgroundColor: background }} />;
```

---

### 4) `lib/appwrite.ts`

* **`createUserAccount(email: string, password: string, name: string)`**
  Creates a new account via Appwrite. On success, returns the created user object. Typical failure cases include duplicate emails or invalid credentials. Wrap calls with `try/catch` and prompts friendly error messages to the UI.

* **`login(email: string, password: string)`**
  Authenticates the user and creates an Appwrite session. The session is then used for subsequent authenticated requests (e.g., reading/writing posts).

* **`logout()`**
  Invalidates the active session.

* **`createPost(data: { title: string; description?: string; imageUrl?: string; ... })`**
  Persists an art‑challenge post in the database. Expect validation on required fields (e.g., `title`). Returns the created document on success.

* **`getPosts()`**
  Retrieves a list of posts/documents for display on the Home feed or Profile pages.

**Usage example**

```ts
import { createUserAccount, login, logout, createPost, getPosts } from "@/lib/appwrite";

await createUserAccount(email, password, name);
const session = await login(email, password);
const created = await createPost({ title: "Inktober Day 1", description: "A quick sketch." });
const posts = await getPosts();
await logout();
```

---

### 5) `contexts/AppwriteConn.ts`

* **`AppwriteClient`**
  A configured Appwrite client instance (endpoint and project ID) used by `lib/appwrite.ts`. 

---

### 6) `contexts/AuthContext.ts`

* **`AuthProvider`**
  React Context Provider that manages authentication state throughout the app.

* **`loginUser(email: string, password: string)` / `logoutUser()`**
  Convenience wrappers around `lib/appwrite.ts` functions. They also update local state and trigger re‑renders for any component consuming the context.

**Usage example**

```tsx
const { user, loginUser, logoutUser } = useAuth();

async function onLogin() {
  await loginUser(email, password);
}

function onLogout() {
  logoutUser();
}
```

---

## Notes

* This README focuses on explainaing on how the project works , how to set it up and helps understand some of the importnat functions used in the app