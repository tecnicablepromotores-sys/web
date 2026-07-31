/**
 * Script de una sola ejecución: asigna el rol de administrador en Firestore
 * al usuario con el correo indicado y normaliza sus campos de perfil.
 *
 * Uso: node scripts/set-admin.mjs [email]
 */
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, query, where, setDoc, doc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCaI5NPapzEe1jK8EfZrnTW8lEytfy4eR4",
  authDomain: "formulario-9b119.firebaseapp.com",
  projectId: "formulario-9b119",
  storageBucket: "formulario-9b119.firebasestorage.app",
  messagingSenderId: "648279847643",
  appId: "1:648279847643:web:802107ded1f0f5957f52fe",
}

const EMAIL = (process.argv[2] || "luifred1998@gmail.com").toLowerCase()

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

try {
  const snap = await getDocs(query(collection(db, "usuarios"), where("email", "==", EMAIL)))

  if (snap.empty) {
    console.log(`[v0] No existe un documento en 'usuarios' con email = ${EMAIL}`)
    const todos = await getDocs(collection(db, "usuarios"))
    console.log(
      `[v0] Usuarios existentes (${todos.size}):`,
      todos.docs.map((d) => ({ id: d.id, email: d.data().email, rol: d.data().rol })),
    )
    process.exit(1)
  }

  for (const d of snap.docs) {
    const data = d.data()
    const payload = {
      rol: "administrador",
      nombre: data.nombre || "Luis Fred",
      telefono: data.telefono || "",
      direccion: data.direccion || "",
      email: EMAIL,
      uid: d.id,
      actualizado: new Date().toISOString(),
    }
    await setDoc(doc(db, "usuarios", d.id), payload, { merge: true })
    console.log(`[v0] Actualizado usuarios/${d.id}:`, payload)
  }

  console.log("[v0] Listo. El rol de administrador ya está guardado en Firestore.")
  process.exit(0)
} catch (err) {
  console.log("[v0] Error:", err.code || "", err.message)
  process.exit(1)
}
