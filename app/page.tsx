'use client'
import ForgotPassword from "@/lib/pages/forgot_pass";
import LoggedIn from "@/lib/pages/logged_in";
import Login from "@/lib/pages/login";
import Register from "@/lib/pages/register";
import { PageType } from "@/lib/types";
import { useState, useEffect } from "react";
import axios from "axios";

export default function _() {
  const [page, setPage] = useState<PageType>("login");
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const res = await axios.get("/api/auth/session", {
        withCredentials: true
      });
      if (res.status === 200 && res.data?.user) {
        setPage("logged_in");
      } else {
        setPage("login");
      }
    } catch {
      setPage("login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {page === "login" && <Login refreshSession={checkSession} setPage={setPage} />}
      {page === "register" && <Register setPage={setPage} />}
      {page === "forgot_pass" && <ForgotPassword setPage={setPage} />}
      {page === "logged_in" && <LoggedIn setPage={setPage} />}
    </>
  );
}