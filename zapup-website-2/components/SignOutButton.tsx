'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SignOutButton as ClerkSignOutButton } from '@clerk/nextjs';
import { toast } from 'sonner';
import { LogOutIcon } from 'lucide-react';

interface SignOutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  showIcon?: boolean;
}

export function SignOutButton({ 
  variant = 'outline',
  className = '',
  showIcon = true 
}: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = () => {
    // Remove any localStorage items related to user data
    localStorage.removeItem('zapup_user_data');
    localStorage.removeItem('zapup_signup_data');
    
    toast.success('Signed out successfully');
    
    // Redirect to home page
    router.push('/');
  };

  return (
    <ClerkSignOutButton>
      <Button
        variant={variant}
        className={className}
        onClick={handleSignOut}
      >
        {showIcon && <LogOutIcon className="h-4 w-4 mr-2" />}
        Sign Out
      </Button>
    </ClerkSignOutButton>
  );
} 