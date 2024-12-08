import React, { useState } from "react";
import { Button } from "./ui/button";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // In a real application, you would upload the file to your server or a service like Cloudinary here
      // For this example, we'll simulate an upload with a timeout and use a data URL
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value && (
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={onRemove}
                variant="destructive"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <img
              className="object-cover w-full h-full"
              alt="Uploaded image"
              src={value}
            />
          </div>
        )}
        {!value && (
          <Button
            type="button"
            variant="secondary"
            disabled={isUploading}
            onClick={() => document.getElementById("imageUpload")?.click()}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload an Image"}
          </Button>
        )}
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};
