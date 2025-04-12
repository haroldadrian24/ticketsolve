"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

interface StatusUpdate {
  status: string;
  timestamp: string;
  comment?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface TicketDetailProps {
  isOpen?: boolean;
  onClose?: () => void;
  ticket?: {
    id: string;
    title: string;
    category: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    statusHistory: StatusUpdate[];
    comments: Comment[];
  };
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "in progress":
      return <RefreshCw className="h-4 w-4 text-blue-500" />;
    case "resolved":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "in progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "resolved":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const TicketDetail = ({
  isOpen = true,
  onClose = () => {},
  ticket,
}: TicketDetailProps) => {
  const [newComment, setNewComment] = useState("");

  // Default ticket data if none is provided
  const defaultTicket = {
    id: "T-12345",
    title: "Issue with Math Exam Grade",
    category: "Grade Consultation",
    description:
      "I believe there was an error in grading my recent math exam. The total points don't match the individual section scores. I would like to request a review of my exam paper.",
    status: "In Progress",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-16T14:20:00Z",
    statusHistory: [
      { status: "Open", timestamp: "2023-05-15T10:30:00Z" },
      {
        status: "In Progress",
        timestamp: "2023-05-16T14:20:00Z",
        comment: "Assigned to Math Department",
      },
    ],
    comments: [
      {
        id: "c1",
        author: "Student",
        content: "I've attached my exam paper for reference.",
        timestamp: "2023-05-15T10:35:00Z",
      },
      {
        id: "c2",
        author: "Admin",
        content:
          "We've received your complaint and forwarded it to the Math Department for review.",
        timestamp: "2023-05-16T09:15:00Z",
      },
    ],
  };

  const ticketData = ticket || defaultTicket;

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // In a real app, this would send the comment to the server
      console.log("Submitting comment:", newComment);
      setNewComment("");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {ticketData.title}
            </DialogTitle>
            <Badge className={getStatusColor(ticketData.status)}>
              {getStatusIcon(ticketData.status)}
              <span className="ml-1">{ticketData.status}</span>
            </Badge>
          </div>
          <DialogDescription className="text-sm text-gray-500">
            Ticket #{ticketData.id} • {ticketData.category} • Created on{" "}
            {formatDate(ticketData.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="pr-4 max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Description Section */}
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <div className="bg-gray-50 p-4 rounded-md text-sm">
                {ticketData.description}
              </div>
            </div>

            {/* Status History Section */}
            <div>
              <h3 className="text-sm font-medium mb-2">Status History</h3>
              <div className="space-y-3">
                {ticketData.statusHistory.map((update, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      {getStatusIcon(update.status)}
                      <span className="ml-2 font-medium">{update.status}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {formatDate(update.timestamp)}
                      </span>
                    </div>
                    {update.comment && (
                      <p className="mt-2 text-sm text-gray-600">
                        {update.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="text-sm font-medium mb-2">Comments</h3>
              <div className="space-y-3">
                {ticketData.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator className="my-4" />

        {/* Add Comment Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Add Comment</h3>
          <Textarea
            placeholder="Type your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Submit Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetail;
