'use client';
import AuthContainer from "@/components/AuthContainer";
import { User } from "@/types/types.";
import { toast } from "sonner";

export default function Page() {

  const handleAuthSuccess = (user: User) => {
    toast.success(`Welcome ${user.name}`);
  };
  return (
    <AuthContainer onAuthSuccess={handleAuthSuccess} />
  );
}