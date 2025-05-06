
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Validacija forme za kategoriju
const categoryFormSchema = z.object({
  id: z.string().optional(),
  nameSr: z.string().min(2, "Ime kategorije mora imati najmanje 2 karaktera"),
  nameEn: z.string().min(2, "Ime kategorije mora imati najmanje 2 karaktera"),
  slug: z.string().optional(),
  descriptionSr: z.string().optional(),
  descriptionEn: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormValues) => Promise<void>;
  category?: any;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  category,
}: CategoryFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nameSr: "",
      nameEn: "",
      slug: "",
      descriptionSr: "",
      descriptionEn: "",
      image: "",
      isActive: true,
      displayOrder: 0,
    },
  });
  
  // Popunjavanje forme kada se učita postojeća kategorija
  useEffect(() => {
    if (category) {
      form.reset({
        id: category.id,
        nameSr: category.name?.sr || "",
        nameEn: category.name?.en || "",
        slug: category.slug || "",
        descriptionSr: category.description?.sr || "",
        descriptionEn: category.description?.en || "",
        image: category.image || "",
        isActive: category.isActive || true,
        displayOrder: category.displayOrder || 0,
      });
    } else {
      form.reset({
        nameSr: "",
        nameEn: "",
        slug: "",
        descriptionSr: "",
        descriptionEn: "",
        image: "",
        isActive: true,
        displayOrder: 0,
      });
    }
  }, [category, form]);
  
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsSubmitting(true);
      await onSave(data);
      setIsSubmitting(false);
      onClose();
      toast.success(category ? "Kategorija je uspešno ažurirana" : "Kategorija je uspešno kreirana");
    } catch (error) {
      console.error("Error saving category:", error);
      setIsSubmitting(false);
      toast.error("Došlo je do greške prilikom čuvanja kategorije");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Izmeni kategoriju" : "Dodaj novu kategoriju"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Izmenite postojeću kategoriju."
              : "Dodajte novu kategoriju u sistem."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nameSr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ime (srpski)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ime kategorije" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ime (engleski)</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="url-friendly-name" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descriptionSr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis (srpski)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Opis kategorije" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descriptionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis (engleski)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Category description" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL slike</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Aktivna</FormLabel>
                    <FormDescription>
                      Kategorija će biti vidljiva na sajtu
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redosled</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      value={field.value || 0} 
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={onClose} 
                type="button" 
                disabled={isSubmitting}
              >
                Otkaži
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Čuvanje..." : "Sačuvaj"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function FormDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className="text-sm text-muted-foreground"
      {...props}
    />
  )
}
