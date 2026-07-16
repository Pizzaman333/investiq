# Firebase setup for InvestIQ

## 1. Authentication

1. Open Firebase Console and select the project.
2. Go to **Authentication > Sign-in method**.
3. Enable **Email/Password**.
4. Enable **Google**, select a project support email, and save.
5. Go to **Authentication > Settings > Authorized domains**.
6. Add `localhost`, `127.0.0.1`, and the production GitHub Pages or custom domain.

Google authentication uses Firebase redirect sign-in. The value of
`VITE_FIREBASE_AUTH_DOMAIN` must match the web application configuration.

For portfolio demos, InvestIQ also includes a local demo mode that does not use
Firebase and does not write to Firestore.

## 2. Firestore Database

1. Go to **Firestore Database** and create a database.
2. Select production mode.
3. Choose a region near the expected users. The region cannot be changed later.
4. Do not create collections manually. InvestIQ creates the user profile, finance
   state, and transaction collection after authentication.

The application stores data at:
 
```text
users/{uid}
users/{uid}/finance/state
users/{uid}/transactions/{transactionId}
```

## 3. Security rules

Open **Firestore Database > Rules**, paste the contents of `firestore.rules`, and
publish them. Committing the file does not deploy the rules automatically.

Use the Rules Playground to verify that an authenticated UID can access only the
matching `users/{uid}` tree and cannot read another user's documents.

## 4. Web configuration

Copy the Firebase web app values from **Project settings > General > Your apps**
into a root `.env` file using `.env.example` as the template. Restart the Vite
development server after changing environment variables.

Do not commit `.env`. Firebase web API keys are client identifiers rather than
server secrets, but access must still be protected by Auth, Firestore rules, and
appropriate API-key restrictions in Google Cloud Console.

Recommended hardening:

- Restrict the Firebase web API key to the expected HTTP referrers in Google
  Cloud Console.
- Keep Firebase Auth authorized domains limited to local development and the
  deployed production domain.
- Consider Firebase App Check before using the app with real public traffic.

## 5. Indexes

No composite indexes are required in this version. InvestIQ subscribes to the
authenticated user's transaction subcollection and performs sorting and report
aggregation in the browser. Firebase will provide a direct index-creation link if
future server-side queries need one.
