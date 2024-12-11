import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";
import api from "@/lib/api";
import { URL_FIX } from "@/lib/constants";
import { logOut } from "@/lib/utils";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number",
  }),
  image: z
    .any()
    .refine((file) => file.length !== 0, "Upload an image")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  category: z.string({
    required_error: "Please select a category",
  }),
});

export default function CreateListingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePath, setImagePath] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      image: "",
      category: "",
    },
  });

  const clearImageInput = () => {
    const fileInput: HTMLInputElement = document.getElementById(
      "imageUpload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const clearAllFields = () => {
    form.reset({
      title: "",
      description: "",
      price: 0,
      category: "",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    if (values.image) {
      formData.append("image", values.image);
    }
    formData.append("category", values.category);

    try {
      const response = await api.post(`${URL_FIX}/create_listing`, formData);
      if (response.status === 401) {
        logOut();
      } else if (response.status === 200) {
        clearAllFields();
        clearImageInput();
        alert(response.data.success);
      } else {
        console.error(response);
      }
    } catch (error) {
      clearAllFields();
      clearImageInput();
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    data-clear
                    placeholder="Enter listing title"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a clear and concise title for your listing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    data-clear
                    placeholder="Describe your item in detail"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of the item you're listing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    data-clear
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Set the price for your item in USD.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="mb-4 flex items-center gap-4">
                    {field.value && (
                      <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                          <Button
                            type="button"
                            onClick={() => {
                              field.onChange("");
                              clearImageInput();
                            }}
                            variant="destructive"
                            size="icon"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <img
                          className="object-cover w-full h-full"
                          alt="Uploaded image"
                          src={imagePath}
                        />
                      </div>
                    )}
                    {!field.value && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          document.getElementById("imageUpload")?.click()
                        }
                      >
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Upload an Image
                      </Button>
                    )}
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        const fileURL = URL.createObjectURL(file as Blob);
                        setImagePath(fileURL);
                        field.onChange(file);
                      }}
                      style={{ display: "none" }}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload a clear image of your item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the most appropriate category for your item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Listing"}
          </Button>
        </form>
      </Form>
    </>
  );
}
