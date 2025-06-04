"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useRoleProtection(role: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyRole() {
      const email = sessionStorage.getItem("email");
      const token = sessionStorage.getItem("token");

      if (!email || !token) {
        router.push("/login");
        return;
      }

      let endpoint = "";
      if (role === "donor") {
        endpoint = `/api/donor/validateUser/${email}`;
      } else if (role === "food-bank") {
        endpoint = `/api/food-bank/validateUser/${email}`;
      }

      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          sessionStorage.clear();
          router.push("/login"); // Redirect if API call fails
          return;
        }

      } catch (error) {
        sessionStorage.clear();
        console.error("Unknown error:", error);
        router.push("/login"); // Redirect on error
      } finally {
        setLoading(false);
      }
    }

    verifyRole();
  }, [role, router]);

  return loading;
}
