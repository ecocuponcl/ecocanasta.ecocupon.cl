import { redirect } from "next/navigation"

export default function AllCategoriesPage() {
  redirect("/category/all")
  return null
}
