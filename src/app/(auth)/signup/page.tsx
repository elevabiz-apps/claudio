"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto" />
          <h2 className="text-lg font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-2">
              Back to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <LayoutDashboard className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">CLAUDIO</span>
        </div>
        <p className="text-sm text-muted-foreground">Create your account</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30"
            />
            <p className="text-[11px] text-muted-foreground">
              Minimum 6 characters
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
