import { Card } from "@/components/ui/card";
import { SignUpForm } from "./components/sign-up-form";
import { Link } from "react-router-dom";
import RyuLogo from "@/assets/ryu-logo-green.png";
import { LayoutHeader } from "@/components/custom/layout";
import { topNav } from "@/lib/topNav";
import { TopNav } from "@/components/top-nav";
import ThemeSwitch from "@/components/theme-switch";

export default function SignUp() {
  return (
    <>
      <LayoutHeader>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
        </div>
      </LayoutHeader>
      <div className="container grid h-svh flex-col items-center justify-center bg-black-foreground lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
          <img
            src={RyuLogo}
            alt="Ryu Logo"
            className="w-40 mx-auto h-full object-contain object-left"
          />

          <Card className="p-6">
            <div className="mb-2 flex flex-col space-y-2 text-left">
              <h1 className="text-lg font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and password to create an account. <br />
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign In
                </Link>
              </p>
            </div>
            <SignUpForm />
            <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
              By creating an account, you agree to our{" "}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
