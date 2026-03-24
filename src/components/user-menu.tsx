"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

export function UserMenu() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [initials, setInitials] = useState("?");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? null);
        const name =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email ??
          "";
        const parts = name.split(/[\s@]+/);
        setInitials(
          parts
            .slice(0, 2)
            .map((p: string) => p[0]?.toUpperCase() ?? "")
            .join("")
        );
      }
    });
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" />
        }
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {email && (
          <>
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium">{email}</p>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
