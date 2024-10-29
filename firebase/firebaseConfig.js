const admin = require('firebase-admin');
const chalk = require('chalk');
//FIREBASE CONST INICIO
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");

//REGISTRAR O INICIAR
const firebaseConfig = {
  apiKey: "AIzaSyAUFlmIfjX7KTRzuxgUaWgbeDU4WdxDiGk",
  authDomain: "dinna-314922.firebaseapp.com",
  projectId: "dinna-314922",
  storageBucket: "dinna-314922.appspot.com",
  messagingSenderId: "747370788084",
  appId: "1:747370788084:web:c9f262677f91444a2b1aa1",
  measurementId: "G-PF9PYPJJX7"
};

const app = initializeApp(firebaseConfig);

const serviceAccount = require("./firebase-config.json"); // Ajusta la ruta al archivo de configuración de tu proyecto Firebase

  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dinna-314922.firebaseio.com' // Reemplaza con la URL de tu proyecto Firebase
});
const db = admin.firestore();

module.exports = { admin, db };
setTimeout(() => {
console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)),chalk.red(`Conectado con Firebase.`));
  }, 3000);
//INICIAR
//const cache = getDatabase(app);
//const analytics = getAnalytics(app);

//FIREBASE CONST FIN