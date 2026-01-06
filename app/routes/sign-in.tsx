import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { useForm } from "react-hook-form";
import { signInFn } from "~/api/auth";
import { Alert } from "~/components/ui/alert";

export default function SignInPage() {
  const { register, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>();
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function togglePassword() {
    setShowPassword((password) => !password);
  }

  async function onSubmit(data: { email: string; password: string }) {
    const res = await signInFn(data);
    if (res.error?.message) {
      if (res.error.message === "Invalid login credentials") {
        setErrorMessage("Invalid email or password");
      } else {
        setErrorMessage(res.error.message);
      }
    }
  }

  return (
    <div className="h-dvh w-dvw flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-gray-500">Please sign in to continue</p>
          {!!errorMessage && <Alert>{errorMessage}</Alert>}
          <form id="sign-in-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                placeholder="Please enter your email"
                {...register("email")}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  placeholder="Please enter your password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                <InputGroupAddon
                  align={"inline-end"}
                  className="cursor-pointer"
                  onClick={togglePassword}
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="sign-in-form">
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
