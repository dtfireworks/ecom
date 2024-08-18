import { credential } from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";

const { privateKey } = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY || "");
console.log(privateKey);
const firebaseAdminConfig = {
  credential: credential.cert({
    privateKey,
    // privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  }),
};

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
  }
}
