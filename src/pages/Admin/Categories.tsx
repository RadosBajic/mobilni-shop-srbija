
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CategoryFormModal } from "@/components/Admin/CategoryFormModal";
import { CategoryService } from "@/services/CategoryService";
import { toast } from "sonner";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash, Edit, Plus } from "lucide-react";

// Updated interface to match the property names from the service
interface FormCategory {
  id?: string;
  name: {
    sr: string;
    en: string;
  };
  slug: string;
  description: {
    sr: string;
    en: string;
  };
  image?: string;
  is_active: boolean;
  display_order: number;
  parent_id?: string | null;
}

// Using the service Category type
import { Category } from "@/services/CategoryService";

// Pages/Admin/Categories.tsx
const Categories = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<FormCategory | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  // Učitaj sve kategorije
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        return await CategoryService.getCategories();
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Došlo je do greške prilikom učitavanja kategorija');
        return [];
      }
    }
  });
  
  // Mutacija za kreiranje/ažuriranje kategorije
  const saveMutation = useMutation({
    mutationFn: async (data: FormCategory) => {
      if (data.id) {
        return await CategoryService.updateCategory(data.id, data);
      } else {
        return await CategoryService.createCategory(data as Omit<Category, 'id' | 'created_at' | 'updated_at'>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategorija je uspešno sačuvana');
      setIsOpen(false);
    },
    onError: (error) => {
      console.error('Error saving category:', error);
      toast.error('Došlo je do greške prilikom čuvanja kategorije');
    }
  });
  
  // Mutacija za brisanje kategorije
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await CategoryService.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategorija je uspešno obrisana');
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      toast.error('Došlo je do greške prilikom brisanja kategorije');
    }
  });
  
  // Handler za čuvanje kategorije
  const handleSaveCategory = async (data: FormCategory) => {
    await saveMutation.mutateAsync(data);
  };
  
  // Handler za brisanje kategorije
  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      await deleteMutation.mutateAsync(categoryToDelete);
      setCategoryToDelete(null);
      setDeleteDialogOpen(false);
    }
  };
  
  // Otvori modal za dodavanje nove kategorije
  const handleAddCategory = () => {
    setCurrentCategory(null);
    setIsOpen(true);
  };
  
  // Otvori modal za izmenu postojeće kategorije
  const handleEditCategory = (category: Category) => {
    // Convert Category to FormCategory
    const formCategory: FormCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      is_active: category.is_active,
      display_order: category.display_order,
      parent_id: category.parent_id
    };
    setCurrentCategory(formCategory);
    setIsOpen(true);
  };
  
  // Otvori dijalog za potvrdu brisanja
  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Kategorije</h1>
        <Button onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Dodaj kategoriju
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">Učitavanje kategorija...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-10">
          <p className="mb-4">Nema dostupnih kategorija.</p>
          <Button onClick={handleAddCategory}>Dodaj prvu kategoriju</Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Redosled</TableHead>
                <TableHead>Ime (SR)</TableHead>
                <TableHead>Ime (EN)</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.display_order}</TableCell>
                  <TableCell>{category.name.sr}</TableCell>
                  <TableCell>{category.name.en}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    <Badge variant={category.is_active ? "primary" : "secondary"}>
                      {category.is_active ? "Aktivna" : "Neaktivna"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(category.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Modal za kreiranje/ažuriranje kategorije */}
      <CategoryFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSaveCategory}
        category={currentCategory}
      />
      
      {/* Dijalog za potvrdu brisanja */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Da li ste sigurni?</AlertDialogTitle>
            <AlertDialogDescription>
              Ova akcija će trajno obrisati kategoriju. Ova akcija je nepovratna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;
