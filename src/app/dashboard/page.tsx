import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LogOut, User, History, Bell } from "lucide-react";
import TicketList from "@/components/tickets/TicketList";
import CreateTicketForm from "@/components/tickets/CreateTicketForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Dashboard() {
  // Mock student data - would be fetched from API in real implementation
  const student = {
    id: "S12345",
    name: "John Doe",
    department: "Computer Science",
    year: "3rd Year",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    notifications: 2,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <h1 className="text-2xl font-bold">TickSolve</h1>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {student.notifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                  {student.notifications}
                </span>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={student.profileImage} alt={student.name} />
                <AvatarFallback>
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{student.name}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {student.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={student.profileImage}
                      alt={student.name}
                    />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ID: {student.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {student.department}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {student.year}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <History className="mr-2 h-4 w-4" />
                    History
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active Tickets</TabsTrigger>
                <TabsTrigger value="resolved">Resolved Tickets</TabsTrigger>
                <TabsTrigger value="all">All Tickets</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                <TicketList status="active" />
              </TabsContent>
              <TabsContent value="resolved" className="mt-4">
                <TicketList status="resolved" />
              </TabsContent>
              <TabsContent value="all" className="mt-4">
                <TicketList status="all" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <CreateTicketForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
