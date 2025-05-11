
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Promotion, SupabasePromotionService } from "@/services/SupabasePromotionService";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Promotions: React.FC = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const allPromotions = await SupabasePromotionService.getPromotions('home');
      setPromotions(allPromotions);
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
      toast({
        variant: "destructive",
        title: language === "sr" ? "Greška" : "Error",
        description: language === "sr" 
          ? "Nije moguće učitati promocije" 
          : "Unable to load promotions"
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "title",
      header: language === "sr" ? "Naslov" : "Title",
      cell: ({ row }: { row: any }) => (
        <div>
          <div className="font-medium">
            {language === "sr" ? row.original.title.sr : row.original.title.en}
          </div>
          <div className="text-sm text-muted-foreground">
            {row.original.position}
          </div>
        </div>
      )
    },
    {
      accessorKey: "image",
      header: language === "sr" ? "Slika" : "Image",
      cell: ({ row }: { row: any }) => (
        <div className="relative w-16 h-16 rounded overflow-hidden">
          <img
            src={row.original.image}
            alt={row.original.title.en}
            className="object-cover w-full h-full"
          />
        </div>
      )
    },
    {
      accessorKey: "is_active",
      header: language === "sr" ? "Status" : "Status",
      cell: ({ row }: { row: any }) => (
        <Badge variant={row.original.is_active ? "default" : "outline"}>
          {row.original.is_active 
            ? (language === "sr" ? "Aktivan" : "Active")
            : (language === "sr" ? "Neaktivan" : "Inactive")}
        </Badge>
      )
    },
    {
      accessorKey: "order",
      header: language === "sr" ? "Redosled" : "Order",
    },
    {
      id: "actions",
      header: language === "sr" ? "Akcije" : "Actions",
      cell: ({ row }: { row: any }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>{language === "sr" ? "Izmeni" : "Edit"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleStatus(row.original)}>
              {row.original.is_active ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  <span>{language === "sr" ? "Deaktiviraj" : "Deactivate"}</span>
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>{language === "sr" ? "Aktiviraj" : "Activate"}</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete(row.original)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{language === "sr" ? "Obriši" : "Delete"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const handleEdit = (promotion: Promotion) => {
    // To be implemented
    console.log('Edit promotion', promotion);
  };

  const handleToggleStatus = async (promotion: Promotion) => {
    try {
      await SupabasePromotionService.updatePromotion(promotion.id, {
        is_active: !promotion.is_active
      });
      
      toast({
        title: language === "sr" ? "Status promenjen" : "Status changed",
        description: promotion.is_active
          ? (language === "sr" ? "Promocija je deaktivirana" : "Promotion has been deactivated")
          : (language === "sr" ? "Promocija je aktivirana" : "Promotion has been activated")
      });
      
      fetchPromotions();
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      toast({
        variant: "destructive",
        title: language === "sr" ? "Greška" : "Error",
        description: language === "sr"
          ? "Nije moguće promeniti status"
          : "Unable to change status"
      });
    }
  };

  const handleDelete = async (promotion: Promotion) => {
    if (confirm(language === "sr" 
      ? "Da li ste sigurni da želite da obrišete ovu promociju?" 
      : "Are you sure you want to delete this promotion?"
    )) {
      try {
        await SupabasePromotionService.deletePromotion(promotion.id);
        toast({
          title: language === "sr" ? "Uspešno obrisano" : "Successfully deleted",
          description: language === "sr"
            ? "Promocija je uspešno obrisana"
            : "Promotion has been successfully deleted"
        });
        fetchPromotions();
      } catch (error) {
        console.error('Error deleting promotion:', error);
        toast({
          variant: "destructive",
          title: language === "sr" ? "Greška" : "Error",
          description: language === "sr"
            ? "Nije moguće obrisati promociju"
            : "Unable to delete promotion"
        });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {language === "sr" ? "Promocije" : "Promotions"}
          </h1>
          <Button onClick={() => {}}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {language === "sr" ? "Nova promocija" : "New Promotion"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === "sr" ? "Lista promocija" : "Promotions List"}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={promotions} 
              loading={loading} 
              searchPlaceholder={language === "sr" 
                ? "Pretraži promocije..." 
                : "Search promotions..."
              }
              searchColumn="title"
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Promotions;
