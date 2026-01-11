import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Phone, User, ArrowRight } from "lucide-react";

export default function Auth() {
    const [location, setLocation] = useLocation();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // DEBUG: Check what Client ID is actually loaded
    console.log("DEBUG: Loaded Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

    // Form States
    const [identifier, setIdentifier] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    const calculateStrength = (pass: string) => {
        let score = 0;
        if (pass.length > 6) score++;
        if (pass.length > 10) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const strength = calculateStrength(password);
    const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"][Math.min(strength, 4)];
    const strengthText = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"][Math.min(strength, 4)];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recaptchaToken) {
            //   toast({ title: "Verification Failed", description: "Please complete the reCAPTCHA", variant: "destructive" });
            //   return; 
            // ReCAPTCHA is strict, maybe opt-out for dev
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("userId", data.userId);

            toast({ title: "Welcome back!", description: "Login successful.", className: "bg-green-500 text-white" });
            setLocation("/dashboard");
        } catch (error: any) {
            toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            const type = identifier.includes("@") ? "email" : "phone";
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, username, password, type })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast({ title: "Account Created", description: "Please login now.", className: "bg-green-500 text-white" });
            // Switch to login tab ideally
        } catch (error: any) {
            toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Hero Image */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-zinc-900 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-blue-900/20" />
                <div className="relative z-10 space-y-6 max-w-lg text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mx-auto flex items-center justify-center text-3xl font-bold"
                    >
                        {'</>'}
                    </motion.div>
                    <h1 className="text-4xl font-bold tracking-tight">Welcome to CodeWeave</h1>
                    <p className="text-zinc-400 text-lg">
                        The premium platform for real-time collaborative coding. Build, share, and innovate together.
                    </p>
                </div>
            </div>

            {/* Right: Auth Forms */}
            <div className="flex items-center justify-center p-6 bg-background">
                <Tabs defaultValue="login" className="w-full max-w-md">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Card className="border-none shadow-none">
                            <CardHeader>
                                <CardTitle className="text-2xl">Access your workspace</CardTitle>
                                <CardDescription>Enter your credentials to continue</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Email or Phone</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="user@example.com"
                                                className="pl-9 rounded-full"
                                                value={identifier}
                                                onChange={(e) => setIdentifier(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-9 rounded-full"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* ReCAPTCHA would go here - commented out until client key is provided */}
                                    {/* <div className="flex justify-center">
                    <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "key"} onChange={setRecaptchaToken} />
                  </div> */}

                                    <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" disabled={isLoading}>
                                        {isLoading ? "Signing in..." : "Sign In"} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                                </div>

                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            try {
                                                if (!credentialResponse.credential) return;

                                                const decoded: any = jwtDecode(credentialResponse.credential);
                                                console.log("Google User:", decoded);

                                                const res = await fetch("/api/auth/google", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        token: credentialResponse.credential,
                                                        googleId: decoded.sub,
                                                        email: decoded.email,
                                                        name: decoded.name
                                                    })
                                                });

                                                const data = await res.json();
                                                if (!res.ok) throw new Error(data.message);

                                                localStorage.setItem("token", data.token);
                                                localStorage.setItem("username", data.username);
                                                localStorage.setItem("userId", data.userId);

                                                toast({ title: "Welcome!", description: `Logged in as ${data.username}`, className: "bg-green-500 text-white" });
                                                setLocation("/dashboard");

                                            } catch (error: any) {
                                                console.error("Google Login Error:", error);
                                                toast({ title: "Login Failed", description: error.message, variant: "destructive" });
                                            }
                                        }}
                                        onError={() => {
                                            toast({ title: "Login Failed", description: "Google popup closed or failed.", variant: "destructive" });
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="register">
                        <Card className="border-none shadow-none">
                            <CardHeader>
                                <CardTitle className="text-2xl">Create an account</CardTitle>
                                <CardDescription>Join CodeWeave today</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Username</Label>
                                        <Input
                                            placeholder="johndoe"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email or Phone</Label>
                                        <Input
                                            placeholder="user@example.com"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            required
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Password</Label>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="rounded-full"
                                        />
                                        {password && (
                                            <div className="space-y-1">
                                                <div className="flex h-1 gap-1">
                                                    {[0, 1, 2, 3, 4].map((i) => (
                                                        <div key={i} className={`h-full flex-1 rounded-full bg-secondary transition-colors ${i < strength ? strengthColor : ''}`} />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-muted-foreground text-right">{strengthText} Password</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirm Password</Label>
                                        <Input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="rounded-full"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" disabled={isLoading}>
                                        {isLoading ? "Creating..." : "Create Account"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
