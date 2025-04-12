"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import TicketDetail from "./TicketDetail";

interface Ticket {
  id: string;
  title: string;
  category: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  date: string;
  description: string;
}

interface TicketListProps {
  tickets?: Ticket[];
}

export default function TicketList({ tickets: propTickets }: TicketListProps) {
  // Default tickets if none are provided
  const defaultTickets: Ticket[] = [
    {
      id: "T-001",
      title: "Classroom Bullying Incident",
      category: "Bullying",
      status: "open",
      date: "2023-05-15",
      description:
        "I've been experiencing bullying from a group of students in my math class.",
    },
    {
      id: "T-002",
      title: "Grade Discrepancy in Biology",
      category: "Grade Consultation",
      status: "in-progress",
      date: "2023-05-10",
      description:
        "I believe there was an error in grading my last biology exam.",
    },
    {
      id: "T-003",
      title: "Cafeteria Food Quality",
      category: "Other",
      status: "resolved",
      date: "2023-05-01",
      description:
        "The quality of food in the cafeteria has significantly declined.",
    },
    {
      id: "T-004",
      title: "Altercation in Hallway",
      category: "School Violence",
      status: "closed",
      date: "2023-04-28",
      description:
        "I witnessed a physical altercation between two students in the east hallway.",
    },
  ];

  const [tickets] = useState<Ticket[]>(propTickets || defaultTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all-statuses");
  const [categoryFilter, setCategoryFilter] =
    useState<string>("all-categories");
  const [sortField, setSortField] = useState<"date" | "status">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter and sort tickets
  const filteredTickets = tickets
    .filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all-statuses" || ticket.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all-categories" ||
        ticket.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        // Sort by status
        const statusOrder = {
          open: 0,
          "in-progress": 1,
          resolved: 2,
          closed: 3,
        };
        return sortDirection === "asc"
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      }
    });

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };

  const toggleSort = (field: "date" | "status") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  <SelectItem value="Bullying">Bullying</SelectItem>
                  <SelectItem value="Grade Consultation">
                    Grade Consultation
                  </SelectItem>
                  <SelectItem value="School Violence">
                    School Violence
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Your Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Title</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Category
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium cursor-pointer"
                      onClick={() => toggleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === "status" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium cursor-pointer"
                      onClick={() => toggleSort("date")}
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === "date" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleTicketClick(ticket)}
                      >
                        <td className="py-3 px-4">{ticket.id}</td>
                        <td className="py-3 px-4">{ticket.title}</td>
                        <td className="py-3 px-4">{ticket.category}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={getStatusColor(ticket.status)}
                            variant="outline"
                          >
                            {ticket.status
                              .replace("-", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(ticket.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-gray-500"
                      >
                        No tickets found. Try adjusting your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedTicket && <TicketDetail ticket={selectedTicket} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
