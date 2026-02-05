import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirige automáticamente a la página de login
  redirect("./login");
}