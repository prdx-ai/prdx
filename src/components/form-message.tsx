import { AlertCircle, CheckCircle } from "lucide-react";

export type Message = {
  type: "success" | "error";
  message: string;
};

export function FormMessage({ message }: { message: Message }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md p-3 ${
        message.type === "error"
          ? "bg-destructive/15 text-destructive"
          : "bg-green-500/15 text-green-500"
      }`}
    >
      {message.type === "error" ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      <p className="text-sm font-medium">{message.message}</p>
    </div>
  );
}
