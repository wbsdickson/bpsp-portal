'use client';

import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';

export default function SettingsPage() {
    const { currentUser, updateUser } = useAppStore();
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: false
    });

    useEffect(() => {
        setMounted(true);
        if (currentUser) {
            setName(currentUser.name);
            setEmail(currentUser.email);
        }
    }, [currentUser]);

    const handleProfileUpdate = () => {
        if (currentUser) {
            updateUser(currentUser.id, { name, email });
            toast.success('Profile updated successfully');
        }
    };

    const handlePasswordUpdate = () => {
        toast.success('Password updated successfully');
    };

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Settings / 設定</h1>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
                    {/* <TabsTrigger value="appearance">Appearance</TabsTrigger> */}
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your personal information and email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleProfileUpdate}>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose what you want to be notified about.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="email-notifs" className="flex flex-col space-y-1">
                                    <span>Email Notifications</span>
                                    <span className="font-normal text-xs text-muted-foreground">Receive emails about your account activity.</span>
                                </Label>
                                <Switch
                                    id="email-notifs"
                                    checked={notifications.email}
                                    onCheckedChange={(c) => setNotifications(prev => ({ ...prev, email: c }))}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="push-notifs" className="flex flex-col space-y-1">
                                    <span>Push Notifications</span>
                                    <span className="font-normal text-xs text-muted-foreground">Receive push notifications on your device.</span>
                                </Label>
                                <Switch
                                    id="push-notifs"
                                    checked={notifications.push}
                                    onCheckedChange={(c) => setNotifications(prev => ({ ...prev, push: c }))}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="marketing-notifs" className="flex flex-col space-y-1">
                                    <span>Marketing Emails</span>
                                    <span className="font-normal text-xs text-muted-foreground">Receive emails about new features and offers.</span>
                                </Label>
                                <Switch
                                    id="marketing-notifs"
                                    checked={notifications.marketing}
                                    onCheckedChange={(c) => setNotifications(prev => ({ ...prev, marketing: c }))}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => toast.success('Notification preferences saved')}>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>
                                Customize the look and feel of the application.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <div className="flex gap-4">
                                    <Button
                                        variant={theme === 'light' ? 'default' : 'outline'}
                                        className="w-full justify-start gap-2"
                                        onClick={() => setTheme('light')}
                                    >
                                        <Sun className="h-4 w-4" /> Light
                                    </Button>
                                    <Button
                                        variant={theme === 'dark' ? 'default' : 'outline'}
                                        className="w-full justify-start gap-2"
                                        onClick={() => setTheme('dark')}
                                    >
                                        <Moon className="h-4 w-4" /> Dark
                                    </Button>
                                    <Button
                                        variant={theme === 'system' ? 'default' : 'outline'}
                                        className="w-full justify-start gap-2"
                                        onClick={() => setTheme('system')}
                                    >
                                        <Laptop className="h-4 w-4" /> System
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>
                                Manage your password and security settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handlePasswordUpdate}>Update Password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
