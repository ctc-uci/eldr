import { useEffect } from "react";

import {
  Button,
  Center,
  Field,
  Heading,
  Input,
  Link as ChakraLink,
  Stack,
  VStack,
} from "@chakra-ui/react";

import { toaster } from "@/components/ui/toaster";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { authenticateGoogleUser } from "@/utils/auth/providers";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const toastAdapter = (opts: { title?: string; description?: string; status?: string }) => {
  toaster.create({ title: opts.title, description: opts.description, type: (opts.status as "success" | "error" | "warning" | "info") ?? "info" });
};

export const Signup = () => {
  const navigate = useNavigate();
  const { signup, handleRedirectResult } = useAuthContext();
  const { backend } = useBackendContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const handleSignup = async (data: SignupFormValues) => {
    try {
      const user = await signup({
        email: data.email,
        password: data.password,
      });

      if (user) {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error) {
        toaster.create({
          title: "An error occurred",
          description: err.message,
          type: "error",
        });
      }
    }
  };

  const handleGoogleSignup = async () => {
    await authenticateGoogleUser();
  };

  useEffect(() => {
    handleRedirectResult(backend, navigate, toastAdapter);
  }, [backend, handleRedirectResult, navigate]);

  return (
    <VStack gap={8} w="300px" marginX="auto">
      <Heading>Signup</Heading>

      <form onSubmit={handleSubmit(handleSignup)} style={{ width: "100%" }}>
        <Stack gap={2}>
          <Field.Root invalid={!!errors.email} w="100%">
            <Center>
              <Input
                placeholder="Email"
                type="email"
                size="lg"
                {...register("email")}
                name="email"
                required
                autoComplete="email"
              />
            </Center>
            <Field.ErrorText>{errors.email?.message?.toString()}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.password}>
            <Center>
              <Input
                placeholder="Password"
                type="password"
                size="lg"
                {...register("password")}
                name="password"
                required
                autoComplete="password"
              />
            </Center>
            <Field.ErrorText>{errors.password?.message?.toString()}</Field.ErrorText>
            <ChakraLink asChild>
              <Link to="/login">
              <Field.HelperText>Click here to login</Field.HelperText>
              </Link>
            </ChakraLink>
          </Field.Root>

          <Button
            type="submit"
            size="lg"
            w="100%"
            disabled={Object.keys(errors).length > 0}
          >
            Signup
          </Button>
        </Stack>
      </form>

      <Button
        variant="solid"
        size="lg"
        onClick={handleGoogleSignup}
        w="100%"
        gap={2}
      >
        <FaGoogle />
        Signup with Google
      </Button>
    </VStack>
  );
};
