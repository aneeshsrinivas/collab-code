import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sun, Monitor, Key, Shield, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const [apiKey, setApiKey] = useState("");

    useEffect(() => {
        const storedKey = localStorage.getItem("openai_api_key");
        if (storedKey) setApiKey(storedKey);
    }, []);

    const handleSave = () => {
        localStorage.setItem("openai_api_key", apiKey);
        toast({
            title: "Settings Saved",
            description: "Your preferences have been updated.",
        });
    };

    return (
        <motion.div
            className="min-h-screen bg-background p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                        <p className="text-muted-foreground">
                            Manage your workspace preferences and API keys
                        </p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* AI Configuration Section */}
                    <section className="space-y-4 p-6 border rounded-lg bg-card">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-md bg-cyan/10 text-cyan">
                                <Key className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-semibold">AI Configuration</h2>
                        </div>
                        <Separator />

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="api-key">OpenAI API Key</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="api-key"
                                        type="password"
                                        placeholder="sk-..."
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="max-w-md"
                                    />
                                    <Button onClick={handleSave}>Save Key</Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Your key is stored locally in your browser and used for AI features.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Appearance Section */}
                    <section className="space-y-4 p-6 border rounded-lg bg-card">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-md bg-purple-500/10 text-purple-500">
                                <Monitor className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-semibold">Appearance</h2>
                        </div>
                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="font-medium">Theme Mode</div>
                                <div className="text-sm text-muted-foreground">
                                    Select your preferred interface theme
                                </div>
                            </div>
                            <div className="flex bg-muted p-1 rounded-lg">
                                <Button
                                    variant={theme === 'light' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setTheme('light')}
                                    className="gap-2"
                                >
                                    <Sun className="w-4 h-4" /> Light
                                </Button>
                                <Button
                                    variant={theme === 'dark' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setTheme('dark')}
                                    className="gap-2"
                                >
                                    <Moon className="w-4 h-4" /> Dark
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
}
