import { TriangleAlert } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export interface AlertInfo{
  title: string;
  message: string;
}

export function AlertDisplay(info: AlertInfo) {
  return (
    <Alert className="flex-1 bg-destructive opacity-90 w-full max-w-md text-white">
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>{info.title + "!"}</AlertTitle>
      <AlertDescription>{info.message}</AlertDescription>
  </Alert>
  )
}
