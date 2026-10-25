"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Lock, AlertCircle } from "lucide-react";

const VALIDATE_URL = "/api/user/viewUser"; // GET, returns 401 when the access token has expired
const REFRESH_URL = "/api/auth/refresh"; // POST { refreshToken }, returns { data: { accessToken } }
const POLL_MS = 10 * 60 * 1000; // 10 minutes

type ModalState = "hidden" | "reauth" | "loading" | "failed";

function forceLogout() {
  ["accessToken", "refreshToken", "type"].forEach((k) =>
    localStorage.removeItem(k)
  );
}

export default function PrivateComponents({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [modalState, setModalState] = useState<ModalState>("hidden");
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const checkSession = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken && !refreshToken) {
        forceLogout();
        router.replace("/");
        return;
      }

      try {
        const res = await axios.get(VALIDATE_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
          validateStatus: () => true, // don't throw on 401, we handle it below
        });

        if (!isMounted.current) return;

        if (res.status === 401) {
          setModalState((s) => (s === "hidden" ? "reauth" : s));
        } else if (res.status >= 200 && res.status < 300) {
          setModalState((s) => (s === "reauth" ? "hidden" : s));
        }
      } catch {
        // network error: still let the page load
      } finally {
        if (isMounted.current) setReady(true);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, POLL_MS);
    window.addEventListener("pageshow", checkSession); // back button after logout
    window.addEventListener("storage", checkSession); // logout from another tab

    return () => {
      isMounted.current = false;
      clearInterval(interval);
      window.removeEventListener("pageshow", checkSession);
      window.removeEventListener("storage", checkSession);
    };
  }, [router]);

  const handleReAuthenticate = async () => {
    setModalState("loading");

    const type = localStorage.getItem("type");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const res = await axios.post(
        REFRESH_URL,
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
          withCredentials: true,
          validateStatus: () => true, // handle status codes manually
        }
      );

      if (res.status >= 200 && res.status < 300) {
        const newAccess = res.data?.data?.accessToken;
        if (!newAccess) {
          setModalState("reauth");
          return;
        }
        localStorage.setItem("accessToken", newAccess);
        setModalState("hidden");
      } else if (res.status === 401) {
        setModalState("failed");
        setTimeout(() => {
          forceLogout();
          router.replace("/");
        }, 2500);
      } else {
        setModalState("reauth");
      }
    } catch {
      setModalState("reauth");
    }
  };

  return (
    <>
      <div hidden={!ready}>{children}</div>

      {modalState !== "hidden" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 backdrop-blur-sm">
          <div className="w-[340px] rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${modalState === "failed"
                  ? "bg-red-50 text-red-700"
                  : "bg-amber-50 text-amber-700"
                }`}
            >
              {modalState === "failed" ? (
                <AlertCircle size={22} />
              ) : (
                <Lock size={22} />
              )}
            </div>

            <h3 className="mb-2 text-base font-semibold text-slate-900">
              {modalState === "failed" ? "Session Expired" : "Session Timed Out"}
            </h3>

            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              {modalState === "reauth" &&
                "Your session has expired. Click below to continue where you left off."}
              {modalState === "loading" &&
                "Restoring your session, please wait…"}
              {modalState === "failed" &&
                "We couldn't restore your session. Logging you out…"}
            </p>

            {(modalState === "reauth" || modalState === "loading") && (
              <button
                type="button"
                onClick={handleReAuthenticate}
                disabled={modalState === "loading"}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                {modalState === "loading" ? "Authenticating…" : "Re-Authenticate"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}