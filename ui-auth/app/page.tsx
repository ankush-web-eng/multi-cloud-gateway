'use client';
import AuthContainer from "@/components/AuthContainer";
import { User } from "@/types/types.";
import { toast } from "sonner";

export default function Page() {

  const handleAuthSuccess = (user: User) => {
    toast.success(`Welcome ${user.name}`);
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirectUrl');
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };
  
  return (
    <AuthContainer onAuthSuccess={handleAuthSuccess} />
  );
}