"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface CreateTicketFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: TicketFormData) => void;
}

interface TicketFormData {
  category: string;
  title: string;
  description: string;
  attachments?: File[];
}

const COMPLAINT_CATEGORIES = [
  { value: "bullying", label: "Bullying" },
  { value: "grade_consultation", label: "Grade Consultation" },
  { value: "school_violence", label: "School Violence" },
  { value: "facility_issue", label: "Facility Issue" },
  { value: "teacher_complaint", label: "Teacher Complaint" },
  { value: "other", label: "Other" },
];

export default function CreateTicketForm({
  open = true,
  onOpenChange,
  onSubmit,
}: CreateTicketFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TicketFormData>({
    category: "",
    title: "",
    description: "",
    attachments: [],
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: keyof TicketFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Close confirmation dialog
    setShowConfirmation(false);

    // Submit the form data
    if (onSubmit) {
      onSubmit(formData);
    }

    // Show success message
    setShowSuccess(true);

    // Reset form after submission
    setTimeout(() => {
      setFormData({
        category: "",
        title: "",
        description: "",
        attachments: [],
      });
      setStep(1);
      setShowSuccess(false);
      if (onOpenChange) {
        onOpenChange(false);
      }
    }, 2000);
  };

  const handleCancel = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !formData.category;
    if (step === 2) return !formData.title;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {step === 1 && "Select Complaint Category"}
            {step === 2 && "Provide Complaint Details"}
            {step === 3 && "Review Your Submission"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative mt-4">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {step > 1 ? <Check size={16} /> : 1}
                </div>
                <span className="ml-2 text-sm font-medium">Category</span>
              </div>
              <div className="flex-1 mx-4 mt-3 border-t border-muted"></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {step > 2 ? <Check size={16} /> : 2}
                </div>
                <span className="ml-2 text-sm font-medium">Details</span>
              </div>
              <div className="flex-1 mx-4 mt-3 border-t border-muted"></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Review</span>
              </div>
            </div>
          </div>

          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Complaint Category</Label>
                <Select
                  value={formData.category || undefined}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPLAINT_CATEGORIES.map((category) => (
                      <SelectItem
                        key={category.value}
                        value={
                          category.value ||
                          `category-${category.label.toLowerCase()}`
                        }
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Please select the category that best describes your complaint.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Complaint Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Complaint Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Brief title of your complaint"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Please provide as much detail as possible about your complaint"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      handleInputChange(
                        "attachments",
                        Array.from(e.target.files),
                      );
                    }
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  You can upload images or documents related to your complaint.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Complaint Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm">Category</h4>
                      <p className="text-sm">
                        {COMPLAINT_CATEGORIES.find(
                          (c) => c.value === formData.category,
                        )?.label || formData.category}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Date</h4>
                      <p className="text-sm">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Title</h4>
                    <p className="text-sm">{formData.title}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Description</h4>
                    <p className="text-sm whitespace-pre-wrap">
                      {formData.description}
                    </p>
                  </div>
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm">Attachments</h4>
                      <ul className="text-sm list-disc pl-5">
                        {Array.from(formData.attachments).map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  Please review your complaint details before submitting.
                </CardFooter>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            {step < 3 ? (
              <Button onClick={handleNext} disabled={isNextDisabled()}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => setShowConfirmation(true)}>
                Submit Complaint
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Complaint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this complaint? Once submitted,
              you cannot edit it directly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complaint Submitted</AlertDialogTitle>
            <AlertDialogDescription>
              Your complaint has been successfully submitted. You can track its
              status in your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
