import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-6xl font-extrabold text-primary">404</h1>
        <h2 className="text-3xl font-bold">Page Not Found</h2>
        <p className="text-xl text-muted-foreground">
          We couldn't find the page you're looking for. It might have been
          removed, renamed, or doesn't exist.
        </p>
        <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
          <Button onClick={() => navigate("/")} className="w-full sm:w-auto">
            <Home className="mr-2 h-4 w-4" /> Return Home
          </Button>
        </div>
      </div>
      <div className="mt-12">
        <svg
          className="w-64 h-64 text-muted-foreground/20"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.472 9.72a.75.75 0 0 0 1.056 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L15.308 8l1.72-1.72a.75.75 0 0 0-1.06-1.06l-1.72 1.72-1.72-1.72a.75.75 0 0 0-1.06 1.06L13.192 8l-1.72 1.72Z" />
          <path
            fillRule="evenodd"
            d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1ZM2.5 12a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
