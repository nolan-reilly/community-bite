"use client";
import { loginDonor, loginFoodBank } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertDisplay, AlertInfo } from "@/components/Alert";
import { useToast } from "@/hooks/use-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [isFoodBank, setIsFoodBank] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertToDisplay, setAlert] = useState<AlertInfo>();

  const _displayAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000); 
  }

  return (
    <div>
      {showAlert && alertToDisplay && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <AlertDisplay {...alertToDisplay} />
        </div>
      )}
    
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Choose your role and enter your credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center">
              <Button
                className={`flex-1 py-1 text-sm ${!isFoodBank ? 'bg-[#BACBA9] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setIsFoodBank(false)}
              >
                Donor
              </Button>
              <Button
                className={`flex-1 py-1 text-sm ${isFoodBank ? 'bg-[#BACBA9] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setIsFoodBank(true)}
              >
                Food Bank
              </Button>
            </div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
              <LoginActionButton
                email={email}
                password={password}
                isFoodBank={isFoodBank}
                loginDonor={loginDonor}
                loginFoodBank={loginFoodBank}
                emailRegex={emailRegex}
                setAlert={setAlert}
                _displayAlert={_displayAlert}
              />

          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm text-gray-600">
              Don't have an account? <a href="/register" className="hover:underline" style={{ color: '#BACBA9' }}>Create Account</a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

interface LoginActionButtonProps {
  email: string;
  password: string;
  isFoodBank: boolean;
  loginDonor: (email: string, password: string) => Promise<any>;
  loginFoodBank: (email: string, password: string) => Promise<any>;
  emailRegex: RegExp;
  setAlert: (info: { title: string; message: string }) => void;
  _displayAlert: () => void;
}

export function LoginActionButton({
  email,
  password,
  isFoodBank,
  loginDonor,
  loginFoodBank,
  emailRegex,
  setAlert,
  _displayAlert,
}: LoginActionButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setAlert({ title: "Invalid field", message: "Please fill all fields" });
      _displayAlert();
      return;
    }

    if (!emailRegex.test(email)) {
      setAlert({ title: "Invalid email", message: "Please enter a valid email address" });
      _displayAlert();
      return;
    }

    try {
      const login_status = isFoodBank
        ? await loginFoodBank(email, password)
        : await loginDonor(email, password);

      if (login_status.success) {
        toast({
          variant: "success",
          title: "Login Successful",
          description: `Welcome ${isFoodBank ? "Food Bank" : "Donor"}!`,
        });
        router.push(isFoodBank ? "/food-bank" : "/donor");
      } else {
        setAlert({
          title: "Login failed",
          message: `Unable to find ${isFoodBank ? "food bank" : "donor"} with email and password.`,
        });
        _displayAlert();
      }
    } catch (error) {
      console.error(error);
      setAlert({
        title: "Login failed!",
        message: "An unexpected error occurred during login.",
      });
      _displayAlert();
    }
  };

  return (
    <Button
      className="w-full bg-[#BACBA9] text-white hover:bg-black"
      onClick={handleLogin}
    >
      Log in
    </Button>
  );
}
