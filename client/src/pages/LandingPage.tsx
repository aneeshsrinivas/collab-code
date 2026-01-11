import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Cpu, Globe, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {'</>'}
                    </div>
                    <span className="font-display font-bold text-xl">CodeWeave</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/auth" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 hover:text-cyan">
                        Sign In
                    </Link>
                    <Link href="/dashboard" className="inline-flex items-center justify-center text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-cyan hover:bg-cyan/90 text-black font-semibold rounded-full px-6 h-10 transition-colors">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 container mx-auto px-6 pt-16 pb-24">
                <div className="text-center max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 text-cyan text-sm font-medium border border-cyan/20"
                    >
                        <Zap className="w-4 h-4" />
                        <span>v2.0 Now Available with AI Assistant</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display font-bold leading-tight"
                    >
                        Code Together.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
                            Anywhere, Instantly.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        The premium real-time collaborative code editor. Built for teams who demand speed, security, and AI-powered productivity.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/auth" className="inline-flex items-center justify-center text-lg font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-14 px-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:scale-105 transition-transform text-white">
                            Start Coding Free <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link href="/dashboard" className="inline-flex items-center justify-center font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-14 px-8 rounded-full text-lg border border-muted-foreground/30 hover:bg-muted/50">
                            View Demo
                        </Link>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-32">
                    {[
                        { icon: Globe, title: "Real-Time Sync", desc: "Sub-millisecond latency using WebSocket & CRDTs for seamless collaboration." },
                        { icon: Code2, title: "Code Execution", desc: "Run Python, Java, and JS code securely in isolated Docker containers." },
                        { icon: Shield, title: "Secure By Design", desc: "Enterprise-grade encryption, role-based access, and reCAPTCHA protection." }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-2xl bg-card border border-border/50 hover:border-cyan/50 hover:shadow-lg hover:shadow-cyan/10 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-cyan/10">
                                <feature.icon className="w-6 h-6 text-foreground group-hover:text-cyan transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t py-12 bg-muted/20">
                <div className="container mx-auto px-6 text-center text-muted-foreground">
                    <p>&copy; 2026 CodeWeave. Made by Aneesh Srinivas.</p>
                </div>
            </footer>
        </div>
    );
}
