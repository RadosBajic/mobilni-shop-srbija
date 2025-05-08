
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, isAdminAuthenticated } from "@/utils/auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createNotification } from "@/services/NotificationService";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Proveri da li je korisnik već prijavljen
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        // Uspešna prijava, kreiraj obaveštenje i preusmeri
        await createNotification(
          "Uspešna prijava",
          "Dobrodošli u admin panel!",
          "success"
        );
        
        toast({
          title: "Prijava uspešna",
          description: "Dobrodošli u admin panel!",
        });
        
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Prijava neuspešna",
          description: "Pogrešno korisničko ime ili lozinka",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Greška pri prijavi:", error);
      toast({
        title: "Greška pri prijavi",
        description: "Došlo je do neočekivane greške",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Prijava</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Korisničko ime</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Unesite korisničko ime"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Lozinka</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Unesite lozinku"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Prijavljivanje..." : "Prijavi se"}
              </Button>
              <div className="text-center text-sm">
                <p className="text-muted-foreground mt-4">
                  Demo kredencijali: admin / password
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
