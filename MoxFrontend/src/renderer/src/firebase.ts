import { initializeApp, getApps } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyB5ouxipSY8eqn9z1W4UUI23r4YOstg90c',
  authDomain: 'moxfile-b856e.firebaseapp.com',
  projectId: 'moxfile-b856e',
  storageBucket: 'moxfile-b856e.firebasestorage.app',
  messagingSenderId: '414708224960',
  appId: '1:414708224960:web:1b01927ce4b5c952416e25',
  measurementId: 'G-26SJFG7EXV'
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const storage = getStorage(app)

export { app, storage }
