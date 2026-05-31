const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let initialized = false;

/**
 * Initializes Firebase Admin SDK.
 * Supports both service account file path and inline env credentials.
 */
function initializeFirebase() {
  if (initialized || admin.apps.length > 0) return;

  let credential;

  let serviceAccountPath = '';
  let hasServiceAccountFile = false;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    hasServiceAccountFile = fs.existsSync(serviceAccountPath);
  }

  if (hasServiceAccountFile) {
    // Option A: Service account JSON file
    const serviceAccount = require(serviceAccountPath);
    credential = admin.credential.cert(serviceAccount);
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Option B: Inline env vars
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    });
  } else {
    throw new Error(
      'Firebase credentials not configured. Set a valid FIREBASE_SERVICE_ACCOUNT_PATH file or inline env vars.'
    );
  }

  admin.initializeApp({ credential });
  initialized = true;
  console.log('✅ Firebase Admin SDK initialized.');
}

initializeFirebase();

const auth = admin.auth();

module.exports = { admin, auth };
