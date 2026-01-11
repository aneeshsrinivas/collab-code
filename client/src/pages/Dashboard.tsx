import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Plus, LogOut, Code, ArrowRight, Hash, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useIDEStore } from "@/lib/store";

export default function Dashboard() {
    const [location, setLocation] = useLocation();
    const { toast } = useToast();
    const [username, setUsername] = useState("User");

    // Room Form States
    const [roomName, setRoomName] = useState("");
    const [roomIdToJoin, setRoomIdToJoin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        const token = localStorage.getItem("token");
        if (!token) {
            setLocation("/auth");
        } else {
            setUsername(storedUser || "Developer");
        }
    }, [setLocation]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        setLocation("/auth");
    };

    const createRoom = async () => {
        setIsLoading(true);
        try {
            const userId = localStorage.getItem("userId");
            const res = await fetch("/api/room/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: roomName, ownerId: userId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast({ title: "Room Created", description: `Room ID: ${data.roomId}`, className: "bg-green-500 text-white" });

            // Navigate to IDE
            // Ideally pass roomId via state or URL
            // For now, let's assume IDE page can parse query param ?room=ID
            window.location.href = `/?room=${data.roomId}`;
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
            setIsCreateDialogOpen(false);
        }
    };

    const joinRoom = async () => {
        setIsLoading(true);
        try {
            const userId = localStorage.getItem("userId");
            const res = await fetch("/api/room/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId: roomIdToJoin, userId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast({ title: "Joined Room", description: `Entered ${data.name}`, className: "bg-green-500 text-white" });
            window.location.href = `/?room=${data.roomId}`;
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
            setIsJoinDialogOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <header className="max-w-6xl mx-auto flex items-center justify-between mb-12">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan to-blue-500 rounded-lg flex items-center justify-center text-background font-bold text-xl">
                        {'</>'}
                    </div>
                    <span className="font-display font-bold text-xl">CodeWeave</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">{username}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout}>
                        <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Create Room Card */}
                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="h-full border-muted bg-gradient-to-br from-card to-muted/20 hover:border-cyan/50 transition-colors cursor-pointer group" onClick={() => setIsCreateDialogOpen(true)}>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-cyan/10 group-hover:bg-cyan/20 flex items-center justify-center mb-4 transition-colors">
                                    <Plus className="w-6 h-6 text-cyan" />
                                </div>
                                <CardTitle>Create New Room</CardTitle>
                                <CardDescription>Start a new collaborative session</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Host a new project, invite up to 5 developers, and code in real-time.
                                </p>
                                <div className="flex items-center text-cyan text-sm font-medium group-hover:gap-2 transition-all">
                                    Create Room <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Join Room Card */}
                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="h-full border-muted bg-gradient-to-br from-card to-muted/20 hover:border-purple-500/50 transition-colors cursor-pointer group" onClick={() => setIsJoinDialogOpen(true)}>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center mb-4 transition-colors">
                                    <Hash className="w-6 h-6 text-purple-500" />
                                </div>
                                <CardTitle>Join Existing Room</CardTitle>
                                <CardDescription>Enter a Room ID to join</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Jump into an ongoing session with your team using their unique Room ID.
                                </p>
                                <div className="flex items-center text-purple-500 text-sm font-medium group-hover:gap-2 transition-all">
                                    Join Room <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Dialogs */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Room</DialogTitle>
                            <DialogDescription>Give your new room a name.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Room Name</Label>
                                <Input placeholder="Project Alpha" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={createRoom} disabled={!roomName || isLoading} className="bg-cyan hover:bg-cyan/90 text-black">
                                {isLoading ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Join Room</DialogTitle>
                            <DialogDescription>Enter the 6-character Room ID.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Room ID</Label>
                                <Input placeholder="A1B2C3" value={roomIdToJoin} onChange={(e) => setRoomIdToJoin(e.target.value.toUpperCase())} maxLength={6} className="font-mono tracking-widest uppercase" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={joinRoom} disabled={roomIdToJoin.length < 6 || isLoading} className="bg-purple-500 hover:bg-purple-600">
                                {isLoading ? "Joining..." : "Join"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
