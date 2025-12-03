# Firebase Setup Guide

Follow these steps to set up Firebase for Shotgun.AI:

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `shotgun-ai` (or your preferred name)
4. (Optional) Enable Google Analytics
5. Click "Create project"

## 2. Enable Google Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Click on **Google**
5. Toggle **Enable**
6. Enter your support email
7. Click **Save**

## 3. Create Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode** (we'll add security rules later)
4. Select a location (choose one close to your users)
5. Click "Enable"

## 4. Register Your Web App

1. In Firebase Console, go to **Project Overview** (gear icon) > **Project settings**
2. Scroll down to "Your apps"
3. Click the **Web** icon `</>`
4. Enter app nickname: `shotgun-ai-web`
5. Check **"Also set up Firebase Hosting"** (optional)
6. Click "Register app"
7. **Copy the configuration values** (you'll need these next)

## 5. Configure Environment Variables

1. In your project root, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in the values from Firebase Console:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

3. **Never commit** the `.env` file (it's already in `.gitignore`)

## 6. Add Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Replace the rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }

       // Group members can read/write group data
       match /groups/{groupId} {
         allow read: if request.auth != null &&
                        request.auth.uid in resource.data.memberIds;
         allow write: if request.auth != null &&
                         request.auth.uid in resource.data.memberIds;
       }

       // Anyone with link can read invite tokens
       match /invites/{inviteId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
3. Click **Publish**

## 7. Deploy Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add each variable:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Make sure to select **Production**, **Preview**, and **Development** for each
6. Click **Save**
7. Redeploy your project

## 8. Test Locally

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. You should now be able to:
   - Sign in with Google
   - Create and save groups to the cloud
   - See real-time updates

## Troubleshooting

- **"Firebase: Error (auth/unauthorized-domain)"**: Add `localhost:5173` to authorized domains in Firebase Console > Authentication > Settings > Authorized domains
- **Vercel deployment**: Add your Vercel domain to authorized domains as well
- **Security rules**: If you get permission denied errors, check your Firestore security rules

## Next Steps

Once Firebase is set up, the app will automatically:
- Save all data to the cloud instead of localStorage
- Sync in real-time across all devices
- Allow group sharing via email and links
