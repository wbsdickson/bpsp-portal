"use client";

import ActionsCell from "@/components/action-cell";
import { CommandMenu } from "@/components/command-menu";
import { DataTable } from "@/components/data-table";
import HeaderPage from "@/components/header-page";
import { InlineEditField } from "@/components/inline-edit-field";
import LocaleSwitcher from "@/components/locale-switcher";
import LocaleTabs from "@/components/locale-tabs";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import RecordTabs from "@/components/record-tabs";
import { Search as SearchComponent } from "@/components/search";
import { TitleField } from "@/components/title-field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchProvider } from "@/context/search-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Home } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IconsSection } from "./_components/icons-section";
import { BaseModal } from "@/components/modals/base-modal";

type Section =
  | "icons"
  | "accordion"
  | "alert-dialog"
  | "avatar"
  | "badge"
  | "breadcrumb"
  | "button"
  | "calendar"
  | "card"
  | "checkbox"
  | "collapsible"
  | "command"
  | "dialog"
  | "dropdown-menu"
  | "input"
  | "input-otp"
  | "popover"
  | "radio"
  | "resizable"
  | "scroll-area"
  | "select"
  | "sheet"
  | "skeleton"
  | "switch"
  | "table"
  | "tabs"
  | "textarea"
  | "toast"
  | "tooltip"
  | "action-cell"
  | "command-menu"
  | "data-table"
  | "header-page"
  | "inline-edit-field"
  | "locale-switcher"
  | "locale-tabs"
  | "page-breadcrumb"
  | "search"
  | "theme-toggle"
  | "title-field"
  | "modals";

type SectionGroup = {
  label: string;
  sections: { key: Section; label: string }[];
};

const iconSections: { key: Section; label: string }[] = [
  { key: "icons", label: "Icons" },
];

const uiSections: { key: Section; label: string }[] = [
  { key: "accordion", label: "Accordion" },
  { key: "alert-dialog", label: "Alert Dialog" },
  { key: "avatar", label: "Avatar" },
  { key: "badge", label: "Badge" },
  { key: "breadcrumb", label: "Breadcrumb" },
  { key: "button", label: "Button" },
  { key: "calendar", label: "Calendar" },
  { key: "card", label: "Card" },
  { key: "checkbox", label: "Checkbox" },
  { key: "collapsible", label: "Collapsible" },
  { key: "command", label: "Command" },
  { key: "dialog", label: "Dialog" },
  { key: "dropdown-menu", label: "Dropdown Menu" },
  { key: "input", label: "Input" },
  { key: "input-otp", label: "Input OTP" },
  { key: "popover", label: "Popover" },
  { key: "radio", label: "Radio" },
  { key: "resizable", label: "Resizable" },
  { key: "scroll-area", label: "Scroll Area" },
  { key: "select", label: "Select" },
  { key: "sheet", label: "Sheet" },
  { key: "skeleton", label: "Skeleton" },
  { key: "switch", label: "Switch" },
  { key: "table", label: "Table" },
  { key: "tabs", label: "Tabs" },
  { key: "textarea", label: "Textarea" },
  { key: "toast", label: "Toast" },
  { key: "tooltip", label: "Tooltip" },
];

const customSections: { key: Section; label: string }[] = [
  { key: "action-cell", label: "Action Cell" },
  { key: "command-menu", label: "Command Menu" },
  { key: "data-table", label: "Data Table" },
  { key: "header-page", label: "Header Page" },
  { key: "inline-edit-field", label: "Inline Edit Field" },
  { key: "locale-switcher", label: "Locale Switcher" },
  { key: "locale-tabs", label: "Locale Tabs" },
  { key: "modals", label: "Modals" },
  { key: "page-breadcrumb", label: "Page Breadcrumb" },
  { key: "search", label: "Search" },
  { key: "theme-toggle", label: "Theme Toggle" },
  { key: "title-field", label: "Title Field" },
];

const sectionGroups: SectionGroup[] = [
  { label: "Icons", sections: iconSections },
  { label: "UI", sections: uiSections },
  { label: "Custom", sections: customSections },
];

export default function DeveloperPage() {
  const [activeSection, setActiveSection] = useState<Section>("icons");

  return (
    <SearchProvider>
      <div className="bg-background min-h-screen">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="border-b px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Developer Handbook</h1>
                <p className="text-muted-foreground mt-1">
                  Test different UI components and variants
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="flex">
            {/* Left Sidebar Navigation */}
            <aside className="w-64 border-r">
              <nav className="p-4">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-4">
                    {sectionGroups.map((group) => (
                      <div key={group.label}>
                        <div className="text-muted-foreground mb-2 px-3 text-xs font-semibold uppercase tracking-wider">
                          {group.label}
                        </div>
                        <ul className="space-y-1">
                          {group.sections.map((section) => (
                            <li key={section.key}>
                              <button
                                onClick={() => setActiveSection(section.key)}
                                className={cn(
                                  "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                                  activeSection === section.key
                                    ? "bg-muted font-medium"
                                    : "hover:bg-muted/50",
                                )}
                              >
                                {section.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </nav>
            </aside>

            {/* Right Content Pane */}
            <main className="flex-1 p-6">
              <ScrollArea className="h-[calc(100vh-200px)]">
                {activeSection === "icons" && <IconsSection />}
                {activeSection === "toast" && <ToastSection />}
                {activeSection === "tabs" && <TabsSection />}
                {activeSection === "input" && <InputSection />}
                {activeSection === "button" && <ButtonSection />}
                {activeSection === "card" && <CardSection />}
                {activeSection === "badge" && <BadgeSection />}
                {activeSection === "checkbox" && <CheckboxSection />}
                {activeSection === "switch" && <SwitchSection />}
                {activeSection === "radio" && <RadioSection />}
                {activeSection === "select" && <SelectSection />}
                {activeSection === "textarea" && <TextareaSection />}
                {activeSection === "avatar" && <AvatarSection />}
                {activeSection === "skeleton" && <SkeletonSection />}
                {activeSection === "alert-dialog" && <AlertDialogSection />}
                {activeSection === "dialog" && <DialogSection />}
                {activeSection === "sheet" && <SheetSection />}
                {activeSection === "popover" && <PopoverSection />}
                {activeSection === "tooltip" && <TooltipSection />}
                {activeSection === "accordion" && <AccordionSection />}
                {activeSection === "collapsible" && <CollapsibleSection />}
                {activeSection === "breadcrumb" && <BreadcrumbSection />}
                {activeSection === "scroll-area" && <ScrollAreaSection />}
                {activeSection === "calendar" && <CalendarSection />}
                {activeSection === "input-otp" && <InputOTPSection />}
                {activeSection === "table" && <TableSection />}
                {activeSection === "dropdown-menu" && <DropdownMenuSection />}
                {activeSection === "command" && <CommandSection />}
                {activeSection === "resizable" && <ResizableSection />}
                {activeSection === "action-cell" && <ActionCellSection />}
                {activeSection === "command-menu" && <CommandMenuSection />}
                {activeSection === "data-table" && <DataTableSection />}
                {activeSection === "header-page" && <HeaderPageSection />}
                {activeSection === "inline-edit-field" && (
                  <InlineEditFieldSection />
                )}
                {activeSection === "locale-switcher" && (
                  <LocaleSwitcherSection />
                )}
                {activeSection === "locale-tabs" && <LocaleTabsSection />}
                {activeSection === "page-breadcrumb" && (
                  <PageBreadcrumbSection />
                )}
                {activeSection === "search" && <SearchSection />}
                {activeSection === "theme-toggle" && <ThemeToggleSection />}
                {activeSection === "title-field" && <TitleFieldSection />}
                {activeSection === "modals" && <ModalsSection />}
              </ScrollArea>
            </main>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

function SectionWrapper({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <Separator />
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function ToastSection() {
  return (
    <SectionWrapper
      title="Toast"
      description="Test different toast notification variants and configurations."
    >
      <div className="space-y-2">
        <Label>Basic Toast Variants</Label>
        <p className="text-muted-foreground text-sm">
          Standard toast notifications with different types
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={() => toast.success("Operation completed successfully!")}
          >
            Success Toast
          </Button>
          <Button
            onClick={() => toast.error("Something went wrong!")}
            variant="destructive"
          >
            Error Toast
          </Button>
          <Button
            onClick={() => toast.info("Here's some information for you")}
            variant="outline"
          >
            Info Toast
          </Button>
          <Button
            onClick={() => toast.warning("Please be careful!")}
            variant="outline"
          >
            Warning Toast
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Toast with Description</Label>
        <p className="text-muted-foreground text-sm">
          Toasts with additional description text
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={() =>
              toast.success("Profile updated", {
                description: "Your changes have been saved successfully.",
              })
            }
          >
            Success with Description
          </Button>
          <Button
            onClick={() =>
              toast.error("Failed to save", {
                description: "Please check your connection and try again.",
              })
            }
            variant="destructive"
          >
            Error with Description
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Toast with Action</Label>
        <p className="text-muted-foreground text-sm">
          Toasts with action buttons for user interaction
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={() =>
              toast.success("File uploaded successfully", {
                description: "Your file has been uploaded to the server.",
                action: {
                  label: "View",
                  onClick: () => {
                    toast.info("Opening file...");
                  },
                },
              })
            }
          >
            Toast with Action
          </Button>
          <Button
            onClick={() =>
              toast.error("Failed to delete item", {
                description: "The item could not be deleted.",
                action: {
                  label: "Retry",
                  onClick: () => {
                    toast.success("Item deleted successfully!");
                  },
                },
                cancel: {
                  label: "Cancel",
                  onClick: () => {
                    toast.info("Deletion cancelled");
                  },
                },
              })
            }
            variant="destructive"
          >
            Toast with Action & Cancel
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Toast with Promise</Label>
        <p className="text-muted-foreground text-sm">
          Toasts that handle async operations with loading, success, and error
          states
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={() => {
              toast.promise(
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve("Data loaded successfully");
                  }, 2000);
                }),
                {
                  loading: "Loading data...",
                  success: "Data loaded successfully!",
                  error: "Failed to load data",
                },
              );
            }}
          >
            Promise Toast (Success)
          </Button>
          <Button
            onClick={() => {
              toast.promise(
                new Promise((_, reject) => {
                  setTimeout(() => {
                    reject(new Error("Network error"));
                  }, 2000);
                }),
                {
                  loading: "Processing request...",
                  success: "Request completed!",
                  error: "Request failed",
                },
              );
            }}
            variant="destructive"
          >
            Promise Toast (Error)
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Loading Toast</Label>
        <p className="text-muted-foreground text-sm">
          Toast notifications that show loading state
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={() => {
              const toastId = toast.loading("Processing your request...");
              setTimeout(() => {
                toast.success("Request completed!", { id: toastId });
              }, 3000);
            }}
          >
            Loading Toast
          </Button>
          <Button
            onClick={() => {
              const toastId = toast.loading("Uploading file...", {
                description: "Please wait while we upload your file.",
              });
              setTimeout(() => {
                toast.success("File uploaded successfully!", {
                  id: toastId,
                  description: "Your file is now available.",
                });
              }, 3000);
            }}
          >
            Loading Toast with Description
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

function TabsSection() {
  return (
    <SectionWrapper
      title="Tabs"
      description="Test different tab component variants and configurations."
    >
      <div className="space-y-2">
        <Label>Default Tabs</Label>
        <p className="text-muted-foreground text-sm">
          Standard tabs with default styling
        </p>
        <div className="pt-2">
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tab 1 Content</CardTitle>
                  <CardDescription>
                    This is the content for the first tab
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>You can put any content here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tab 2 Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Different content for tab 2.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tab 3 Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Content for the third tab.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Outline Tabs</Label>
        <p className="text-muted-foreground text-sm">
          Tabs with outline variant styling
        </p>
        <div className="pt-2">
          <Tabs defaultValue="outline1" className="w-full">
            <TabsList variant="outline">
              <TabsTrigger value="outline1" variant="outline">
                Outline Tab 1
              </TabsTrigger>
              <TabsTrigger value="outline2" variant="outline">
                Outline Tab 2
              </TabsTrigger>
              <TabsTrigger value="outline3" variant="outline">
                Outline Tab 3
              </TabsTrigger>
            </TabsList>
            <TabsContent value="outline1" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p>Outline tab 1 content</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="outline2" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p>Outline tab 2 content</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="outline3" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p>Outline tab 3 content</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Separator />

      {/* Record Tabs */}
      <div className="space-y-2">
        <Label>Record Tabs</Label>
        <p className="text-muted-foreground text-sm">
          Record tabs with dynamic tab management, closable tabs, and content
          panels
        </p>
        <div className="pt-2">
          <RecordTabs
            initialTabs={[
              { key: "tab1", label: "Tab 1", closable: false },
              { key: "tab2", label: "Tab 2", closable: true },
              { key: "tab3", label: "Tab 3", closable: true },
            ]}
            defaultActiveKey="tab1"
            renderTab={(tab, helpers) => {
              return (
                <div className="p-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {tab.label} Content
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      This is the content for {tab.label}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p>Active tab: {helpers.activeKey}</p>
                    <p>Total tabs: {helpers.tabItems.length}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          helpers.addTab({
                            key: `tab-${Date.now()}`,
                            label: `New Tab ${helpers.tabItems.length + 1}`,
                            closable: true,
                          })
                        }
                      >
                        Add Tab
                      </Button>
                      {tab.closable && (
                        <Button
                          variant="destructive"
                          onClick={() => helpers.removeTab(tab.key)}
                        >
                          Close This Tab
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

function InputSection() {
  return (
    <SectionWrapper
      title="Input"
      description="Test different input field variants and configurations."
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Your name" />
        <p className="text-muted-foreground text-sm">
          This is a basic text input field
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="example@example.com" />
        <p className="text-muted-foreground text-sm">
          Email input with type validation
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
        />
        <p className="text-muted-foreground text-sm">
          Password input with hidden characters
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="disabled">Disabled Input</Label>
        <Input id="disabled" placeholder="This input is disabled" disabled />
        <p className="text-muted-foreground text-sm">Disabled input field</p>
      </div>
    </SectionWrapper>
  );
}

function ButtonSection() {
  return (
    <SectionWrapper
      title="Button"
      description="Test different button variants and sizes."
    >
      <div className="space-y-2">
        <Label>Button Variants</Label>
        <p className="text-muted-foreground text-sm">
          Different button style variants
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Button Sizes</Label>
        <p className="text-muted-foreground text-sm">Different button sizes</p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Button States</Label>
        <p className="text-muted-foreground text-sm">
          Disabled and loading states
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button disabled>Disabled</Button>
          <Button>Enabled</Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

function CardSection() {
  return (
    <SectionWrapper
      title="Card"
      description="Test card component with different content."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the card content area.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Another Card</CardTitle>
            <CardDescription>With different content</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You can put any content inside cards.</p>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}

function BadgeSection() {
  return (
    <SectionWrapper title="Badge" description="Test different badge variants.">
      <div className="space-y-2">
        <Label>Badge Variants</Label>
        <p className="text-muted-foreground text-sm">
          Different badge style variants
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>
    </SectionWrapper>
  );
}

function CheckboxSection() {
  return (
    <SectionWrapper title="Checkbox" description="Test checkbox component.">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="newsletter" defaultChecked />
          <Label htmlFor="newsletter">Subscribe to newsletter</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="disabled" disabled />
          <Label htmlFor="disabled">Disabled checkbox</Label>
        </div>
      </div>
    </SectionWrapper>
  );
}

function SwitchSection() {
  return (
    <SectionWrapper title="Switch" description="Test switch component.">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="notifications" defaultChecked />
          <Label htmlFor="notifications">Enable notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="switch-disabled" disabled />
          <Label htmlFor="switch-disabled">Disabled switch</Label>
        </div>
      </div>
    </SectionWrapper>
  );
}

function RadioSection() {
  return (
    <SectionWrapper
      title="Radio Group"
      description="Test radio group component."
    >
      <div className="space-y-4">
        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1">Default</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comfortable" id="r2" />
            <Label htmlFor="r2">Comfortable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="r3" />
            <Label htmlFor="r3">Compact</Label>
          </div>
        </RadioGroup>
      </div>
    </SectionWrapper>
  );
}

function SelectSection() {
  return (
    <SectionWrapper
      title="Select"
      description="Test select dropdown component."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Language</Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SectionWrapper>
  );
}

function TextareaSection() {
  return (
    <SectionWrapper title="Textarea" description="Test textarea component.">
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" placeholder="Type your message here..." />
        <p className="text-muted-foreground text-sm">Multi-line text input</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="textarea-disabled">Disabled Textarea</Label>
        <Textarea id="textarea-disabled" placeholder="Disabled" disabled />
        <p className="text-muted-foreground text-sm">Disabled textarea field</p>
      </div>
    </SectionWrapper>
  );
}

function AvatarSection() {
  return (
    <SectionWrapper title="Avatar" description="Test avatar component.">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      </div>
    </SectionWrapper>
  );
}

function SkeletonSection() {
  return (
    <SectionWrapper
      title="Skeleton"
      description="Test skeleton loading component."
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    </SectionWrapper>
  );
}

function AlertDialogSection() {
  return (
    <SectionWrapper
      title="Alert Dialog"
      description="Test alert dialog component."
    >
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionWrapper>
  );
}

function DialogSection() {
  return (
    <SectionWrapper title="Dialog" description="Test dialog component.">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-name">Name</Label>
              <Input id="dialog-name" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-email">Email</Label>
              <Input
                id="dialog-email"
                type="email"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
}

function SheetSection() {
  return (
    <SectionWrapper
      title="Sheet"
      description="Test sheet component (side panel)."
    >
      <div className="flex gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open Right Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sheet-name">Name</Label>
                <Input id="sheet-name" placeholder="Your name" />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open Left Sheet</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>This is a left-side sheet.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </SectionWrapper>
  );
}

function PopoverSection() {
  return (
    <SectionWrapper title="Popover" description="Test popover component.">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-muted-foreground text-sm">
              Set the dimensions for the layer.
            </p>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  defaultValue="100%"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Max. width</Label>
                <Input
                  id="maxWidth"
                  defaultValue="300px"
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </SectionWrapper>
  );
}

function TooltipSection() {
  return (
    <SectionWrapper title="Tooltip" description="Test tooltip component.">
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This is a tooltip</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Top tooltip</Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Tooltip on top</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Bottom tooltip</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Tooltip on bottom</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </SectionWrapper>
  );
}

function AccordionSection() {
  return (
    <SectionWrapper title="Accordion" description="Test accordion component.">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other components
            aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It's animated by default, but you can disable it if you prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SectionWrapper>
  );
}

function CollapsibleSection() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SectionWrapper
      title="Collapsible"
      description="Test collapsible component."
    >
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between space-x-4">
          <h4 className="text-sm font-semibold">
            @peduarte starred 3 repositories
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronDown /> : <ChevronRight />}
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          @radix-ui/primitives
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            @radix-ui/colors
          </div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            @stitches/react
          </div>
        </CollapsibleContent>
      </Collapsible>
    </SectionWrapper>
  );
}

function BreadcrumbSection() {
  return (
    <SectionWrapper
      title="Breadcrumb"
      description="Test breadcrumb navigation component."
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="size-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </SectionWrapper>
  );
}

function ScrollAreaSection() {
  return (
    <SectionWrapper
      title="Scroll Area"
      description="Test scroll area component."
    >
      <ScrollArea className="h-72 w-full rounded-md border p-4">
        <div className="space-y-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="text-sm">
              Item {i + 1} - This is a scrollable area with custom scrollbar
              styling.
            </div>
          ))}
        </div>
      </ScrollArea>
    </SectionWrapper>
  );
}

function CalendarSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <SectionWrapper
      title="Calendar"
      description="Test calendar date picker component."
    >
      <CalendarComponent
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </SectionWrapper>
  );
}

function InputOTPSection() {
  return (
    <SectionWrapper title="Input OTP" description="Test OTP input component.">
      <div className="space-y-2">
        <Label>One-Time Password</Label>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <p className="text-muted-foreground text-sm">Enter your 6-digit code</p>
      </div>
    </SectionWrapper>
  );
}

function TableSection() {
  return (
    <SectionWrapper title="Table" description="Test table component.">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV002</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>PayPal</TableCell>
            <TableCell className="text-right">$150.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV003</TableCell>
            <TableCell>Unpaid</TableCell>
            <TableCell>Bank Transfer</TableCell>
            <TableCell className="text-right">$350.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </SectionWrapper>
  );
}

function DropdownMenuSection() {
  return (
    <SectionWrapper
      title="Dropdown Menu"
      description="Test dropdown menu component."
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SectionWrapper>
  );
}

function CommandSection() {
  return (
    <SectionWrapper
      title="Command"
      description="Test command palette component."
    >
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Settings">
            <CommandItem>Profile</CommandItem>
            <CommandItem>Billing</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </SectionWrapper>
  );
}

function ResizableSection() {
  return (
    <SectionWrapper
      title="Resizable"
      description="Test resizable panels component."
    >
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] max-w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Panel 1</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Panel 2</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </SectionWrapper>
  );
}

function ActionCellSection() {
  const mockItem = { id: "1", name: "Test Item" };
  const actions = [
    {
      title: "Edit",
      onPress: (item: typeof mockItem) => toast.info(`Editing ${item.name}`),
    },
    {
      title: "Delete",
      variant: "destructive" as const,
      onPress: (item: typeof mockItem) => toast.error(`Deleting ${item.name}`),
      confirmation: {
        title: "Delete Item",
        description: "Are you sure you want to delete this item?",
      },
    },
  ];
  return (
    <SectionWrapper
      title="Action Cell"
      description="Test action cell component with dropdown menu and confirmation dialogs."
    >
      <div className="space-y-2">
        <Label>Action Cell Example</Label>
        <p className="text-muted-foreground text-sm">
          Click the three dots to see available actions
        </p>
        <div className="pt-2">
          <ActionsCell
            item={mockItem}
            actions={actions}
            t={(key: string) => key}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

function CommandMenuSection() {
  return (
    <SectionWrapper
      title="Command Menu"
      description="Test command menu component (press Cmd+K or click search)."
    >
      <div className="space-y-2">
        <Label>Command Menu</Label>
        <p className="text-muted-foreground text-sm">
          Press Cmd+K (or Ctrl+K) to open the command menu, or use the search
          button
        </p>
        <div className="pt-2">
          <SearchComponent />
        </div>
        <div className="pt-4">
          <CommandMenu />
        </div>
      </div>
    </SectionWrapper>
  );
}

function DataTableSection() {
  const columns = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Role",
    },
  ] as any[];

  const data = [
    { name: "John Doe", email: "john@example.com", role: "Admin" },
    { name: "Jane Smith", email: "jane@example.com", role: "User" },
    { name: "Bob Johnson", email: "bob@example.com", role: "User" },
  ];

  return (
    <SectionWrapper
      title="Data Table"
      description="Test data table component with sorting, filtering, and pagination."
    >
      <DataTable columns={columns} data={data} filterColumnId="name" />
    </SectionWrapper>
  );
}

function HeaderPageSection() {
  return (
    <SectionWrapper
      title="Header Page"
      description="Test header page component with title and actions."
    >
      <HeaderPage title="Example Page" pageActions={<Button>Action</Button>}>
        <Card>
          <CardContent className="pt-6">
            <p>This is the page content</p>
          </CardContent>
        </Card>
      </HeaderPage>
    </SectionWrapper>
  );
}

function InlineEditFieldSection() {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
    },
  });

  const onSubmit = (data: { name: string; email: string; phone: string }) => {
    console.log("Form submitted:", data);
    setIsEditing(false);
    toast.success("Form saved successfully!");
  };

  return (
    <SectionWrapper
      title="Inline Edit Field"
      description="Test inline edit field component with react-hook-form."
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Inline Edit Field Example</Label>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Click "Edit" to enable inline editing. The component switches between
          display and edit modes.
        </p>
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InlineEditField
                    control={form.control}
                    name="name"
                    label="Name"
                    isEditing={isEditing}
                    value={form.watch("name")}
                    renderInput={(field) => <Input {...field} />}
                  />
                  <InlineEditField
                    control={form.control}
                    name="email"
                    label="Email"
                    isEditing={isEditing}
                    value={form.watch("email")}
                    renderInput={(field) => <Input {...field} type="email" />}
                  />
                  <InlineEditField
                    control={form.control}
                    name="phone"
                    label="Phone"
                    isEditing={isEditing}
                    value={form.watch("phone")}
                    renderInput={(field) => <Input {...field} />}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}

function LocaleSwitcherSection() {
  return (
    <SectionWrapper
      title="Locale Switcher"
      description="Test locale switcher dropdown component."
    >
      <div className="space-y-2">
        <Label>Locale Switcher</Label>
        <p className="text-muted-foreground text-sm">
          Dropdown to switch between available locales
        </p>
        <div className="pt-2">
          <LocaleSwitcher />
        </div>
      </div>
    </SectionWrapper>
  );
}

function LocaleTabsSection() {
  const [locale, setLocale] = useState<"en" | "ja">("en");
  return (
    <SectionWrapper
      title="Locale Tabs"
      description="Test locale tabs component for switching languages."
    >
      <div className="space-y-2">
        <Label>Locale Tabs</Label>
        <p className="text-muted-foreground text-sm">
          Tab-based locale switcher
        </p>
        <div className="pt-2">
          <LocaleTabs value={locale} onValueChange={setLocale} />
          <p className="text-muted-foreground mt-4 text-sm">
            Selected locale: {locale}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}

function PageBreadcrumbSection() {
  return (
    <SectionWrapper
      title="Page Breadcrumb"
      description="Test page breadcrumb navigation component."
    >
      <div className="space-y-2">
        <Label>Page Breadcrumb</Label>
        <p className="text-muted-foreground text-sm">
          Navigation breadcrumb component
        </p>
        <div className="pt-2">
          <PageBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Components", href: "/components" },
              { label: "Breadcrumb", active: true },
            ]}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

function SearchSection() {
  return (
    <SectionWrapper
      title="Search"
      description="Test search component that opens command menu."
    >
      <div className="space-y-2">
        <Label>Search Component</Label>
        <p className="text-muted-foreground text-sm">
          Search button that opens the command menu
        </p>
        <div className="pt-2">
          <SearchComponent />
        </div>
      </div>
    </SectionWrapper>
  );
}

function ThemeToggleSection() {
  return (
    <SectionWrapper
      title="Theme Toggle"
      description="Test theme toggle component for switching between light, dark, and system themes."
    >
      <div className="space-y-2">
        <Label>Theme Toggle Example</Label>
        <p className="text-muted-foreground text-sm">
          Click the button to cycle through themes: Light → Dark → System →
          Light
        </p>
        <div className="pt-2">
          <ThemeToggle />
        </div>
        <div className="mt-4 rounded-md border p-4">
          <p className="text-muted-foreground text-sm">
            The theme toggle cycles through three modes:
          </p>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              <strong>Light:</strong> Always use light theme
            </li>
            <li>
              <strong>Dark:</strong> Always use dark theme
            </li>
            <li>
              <strong>System:</strong> Follow system preference
            </li>
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}

function TitleFieldSection() {
  return (
    <SectionWrapper
      title="Title Field"
      description="Test title field component for displaying labeled values."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title Field Examples</Label>
          <p className="text-muted-foreground text-sm">
            Display label-value pairs
          </p>
          <div className="space-y-4 pt-2">
            <TitleField label="Name" value="John Doe" />
            <TitleField label="Email" value="john@example.com" />
            <TitleField label="Role" value={<Badge>Admin</Badge>} />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function ModalsSection() {
  const [baseModalOpen, setBaseModalOpen] = useState(false);
  const [baseModalNoTitleOpen, setBaseModalNoTitleOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <SectionWrapper
      title="Modals"
      description="Test different modal components including BaseModal, AlertDialog, Dialog, and Sheet."
    >
      <div className="space-y-6">
        {/* BaseModal */}
        <div className="space-y-2">
          <Label>BaseModal</Label>
          <p className="text-muted-foreground text-sm">
            Custom modal component built on top of AlertDialog with consistent
            styling
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => setBaseModalOpen(true)}>
              Open BaseModal
            </Button>
          </div>
          <BaseModal
            open={baseModalOpen}
            onOpenChange={setBaseModalOpen}
            title="BaseModal Example"
            description="This is a custom modal component with title and description."
          >
            <div className="space-y-4 py-4">
              <p className="text-sm">
                This modal uses the BaseModal component which wraps AlertDialog
                with consistent styling and structure.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBaseModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setBaseModalOpen(false)}>Confirm</Button>
              </div>
            </div>
          </BaseModal>
        </div>

        {/* BaseModal without Title */}
        <div className="space-y-2">
          <Label>BaseModal (without Title/Description Props)</Label>
          <p className="text-muted-foreground text-sm">
            Use BaseModal without title/description props when you need full
            control over the content structure, such as simple confirmations or
            custom layouts
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => setBaseModalNoTitleOpen(true)}>
              Open BaseModal (No Title Props)
            </Button>
          </div>
          <BaseModal
            open={baseModalNoTitleOpen}
            onOpenChange={setBaseModalNoTitleOpen}
          >
            <div className="space-y-4 py-4">
              <p className="text-sm">
                This is a simple confirmation dialog without using title and
                description props. Perfect for quick actions or when you need
                custom content layout.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBaseModalNoTitleOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setBaseModalNoTitleOpen(false)}>
                  Confirm
                </Button>
              </div>
            </div>
          </BaseModal>
        </div>

        {/* AlertDialog */}
        <div className="space-y-2">
          <Label>AlertDialog</Label>
          <p className="text-muted-foreground text-sm">
            Alert dialog for important confirmations and actions
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <AlertDialog
              open={alertDialogOpen}
              onOpenChange={setAlertDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Open AlertDialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Dialog */}
        <div className="space-y-2">
          <Label>Dialog</Label>
          <p className="text-muted-foreground text-sm">
            Standard dialog for forms and content
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john@example.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Sheet */}
        <div className="space-y-2">
          <Label>Sheet</Label>
          <p className="text-muted-foreground text-sm">
            Slide-over panel from the edge of the screen
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button>Open Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit Profile</SheetTitle>
                  <SheetDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sheet-name">Name</Label>
                    <Input id="sheet-name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sheet-email">Email</Label>
                    <Input
                      id="sheet-email"
                      type="email"
                      defaultValue="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sheet-phone">Phone</Label>
                    <Input id="sheet-phone" defaultValue="+1 234 567 8900" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSheetOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setSheetOpen(false)}
                  >
                    Save
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
