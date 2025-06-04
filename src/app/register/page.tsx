"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerDonor, registerFoodBank, loginFoodBank, loginDonor } from "@/lib/auth";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [isFoodBank, setIsFoodBank] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    password: "",
    address: ""
  });


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Register</h1>
        <p className="text-center text-gray-600 mb-6">Create an account to get started</p>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`w-1/2 py-2 text-sm rounded-md ${
              !isFoodBank
                ? "bg-[#BACBA9] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setIsFoodBank(false)}
          >
            Donor
          </button>
          <button
            className={`w-1/2 py-2 text-sm rounded-md ${
              isFoodBank
                ? "bg-[#BACBA9] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setIsFoodBank(true)}
          >
            Food Bank
          </button>
        </div>

        {/* Registration Form */}
        <form className="space-y-4">
          {!isFoodBank && (
            <div className="grid grid-cols-2 gap-4">
              <input
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#BACBA9]"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <input
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#BACBA9]"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          )}

          {isFoodBank && (
            <input
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#BACBA9]"
              type="text"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
            />
          )}

          <input
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#BACBA9]"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <input
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#BACBA9]"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <AddressAutocomplete handleAddressChange={(value) => setFormData({ ...formData, address: value })} />

          <RegisterActionButton
            formData={formData}
            isFoodBank={isFoodBank}
          />
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="hover:underline"
            style={{ color: "#BACBA9" }}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

interface RegisterActionButtonProps {
  formData: {
    firstName: string;
    lastName: string;
    businessName: string;
    email: string;
    password: string;
    address: string;
  };
  isFoodBank: boolean;
}

export function RegisterActionButton({ formData, isFoodBank }: RegisterActionButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      (isFoodBank && !formData.businessName) ||
      (!isFoodBank && (!formData.firstName || !formData.lastName)) ||
      !formData.email ||
      !formData.password ||
      !formData.address
    ) {
      toast({
        variant: "destructive",
        title: "Invalid Field",
        description: "Please fill all fields",
      });
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address",
      });
      return;
    }

    try {
      const response = isFoodBank
        ? await registerFoodBank(formData)
        : await registerDonor(formData);

      toast({
        variant: "success",
        title: "Registration Successful",
        description: response.data.message,
      });

      const login = isFoodBank ? loginFoodBank : loginDonor;
      await login(formData.email, formData.password);

      router.push(isFoodBank ? "/food-bank" : "/donor");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Something went wrong",
      });
      console.error(error);
    }
  };

  return (
    <Button
      className="w-full py-3 mt-4 bg-[#BACBA9] text-white font-bold hover:bg-black"
      onClick={handleRegister}
    >
      Register
    </Button>
  );
}
