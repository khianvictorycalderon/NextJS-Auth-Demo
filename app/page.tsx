'use client'
import Login from "@/lib/pages/login";
import Register from "@/lib/pages/register";
import { PageType } from "@/lib/types";
import { useState } from "react";

export default function _() {

  const [page, setPage] = useState<PageType>("login");

  return (
    <>
      {page === "login" && <Login setPage={setPage}/>}
      {page === "register" && <Register setPage={setPage}/>}
    </>
  )
}