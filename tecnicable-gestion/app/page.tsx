import { redirect } from "next/navigation"

export default function Page() {
  // La aplicación Tecnicable Pro es una app HTML autocontenida servida desde /public
  redirect("/tecnicable.html")
}
