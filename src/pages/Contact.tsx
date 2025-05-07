
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ChevronRight, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Poruka poslata",
        description: "Vaša poruka je uspešno poslata. Odgovorićemo vam u najkraćem mogućem roku.",
      });
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/">Početna</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <span className="text-muted-foreground">Kontakt</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Kontaktirajte nas</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Imate pitanja ili vam je potrebna pomoć? Naš tim je tu da vam pomogne. Slobodno nas kontaktirajte putem bilo kog kanala ispod.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="hover-lift transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Naša adresa</h3>
              <p className="text-muted-foreground mb-2">
                Bulevar Kralja Aleksandra 235<br />
                11000 Beograd, Srbija
              </p>
              <Button variant="link" className="mt-2">
                Prikaži na mapi
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover-lift transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Telefon</h3>
              <p className="text-muted-foreground mb-1">
                Prodaja: +381 11 123 4567
              </p>
              <p className="text-muted-foreground mb-1">
                Tehnička podrška: +381 11 234 5678
              </p>
              <p className="text-muted-foreground">
                Servis: +381 11 345 6789
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Radno vreme</h3>
              <p className="text-muted-foreground mb-1">
                Ponedeljak - Petak: 09:00 - 20:00
              </p>
              <p className="text-muted-foreground mb-1">
                Subota: 10:00 - 17:00
              </p>
              <p className="text-muted-foreground">
                Nedelja: Zatvoreno
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="hover-lift transition-all">
              <CardHeader>
                <CardTitle>Pošaljite nam poruku</CardTitle>
                <CardDescription>
                  Popunite formu ispod i odgovorićemo vam u najkraćem mogućem roku.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ime i prezime</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email adresa</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Naslov</Label>
                    <Input 
                      id="subject" 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Poruka</Label>
                    <Textarea 
                      id="message" 
                      rows={6} 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto hover-scale"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Slanje...' : 'Pošalji poruku'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="hover-lift transition-all h-full">
              <CardHeader>
                <CardTitle>Email kontakt</CardTitle>
                <CardDescription>
                  Pošaljite nam email direktno na sledeće adrese:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Opšta pitanja</h4>
                      <a href="mailto:info@mojprodavnica.rs" className="text-primary hover:underline">
                        info@mojprodavnica.rs
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Prodaja</h4>
                      <a href="mailto:prodaja@mojprodavnica.rs" className="text-primary hover:underline">
                        prodaja@mojprodavnica.rs
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Tehnička podrška</h4>
                      <a href="mailto:podrska@mojprodavnica.rs" className="text-primary hover:underline">
                        podrska@mojprodavnica.rs
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Reklamacije</h4>
                      <a href="mailto:reklamacije@mojprodavnica.rs" className="text-primary hover:underline">
                        reklamacije@mojprodavnica.rs
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-lg hover-lift transition-all mb-12">
          <div className="h-[400px] w-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.697083983373!2d20.47932447652076!3d44.79748897909878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7a9f56d14c25%3A0xc3afc2a32ac2b5d3!2sKnez%20Mihailova%2C%20Beograd!5e0!3m2!1sen!2srs!4v1713054100649!5m2!1sen!2srs" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokacija prodavnice"
            ></iframe>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Često postavljena pitanja</h2>
            <p className="text-muted-foreground">
              Odgovori na najčešća pitanja koja dobijamo od naših kupaca.
            </p>
          </div>
          
          <div className="space-y-4">
            <Card className="hover-lift transition-all">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Koji je rok isporuke?</h3>
                <p className="text-muted-foreground">
                  Rok isporuke je obično 2-3 radna dana za područje Beograda, a 3-5 radnih dana za ostatak Srbije.
                  Za hitne isporuke, kontaktirajte nas telefonom.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift transition-all">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Da li mogu da vratim proizvod?</h3>
                <p className="text-muted-foreground">
                  Da, možete vratiti proizvod u roku od 14 dana od datuma kupovine, pod uslovom da je proizvod neoštećen
                  i u originalnom pakovanju. Za više informacija, pogledajte našu politiku vraćanja.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift transition-all">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Koji su načini plaćanja?</h3>
                <p className="text-muted-foreground">
                  Prihvatamo plaćanje karticama (Visa, MasterCard, Maestro), pouzećem (gotovinom prilikom dostave)
                  i bankovnim transferom. Takođe podržavamo plaćanje na rate za određene kartice.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift transition-all">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Da li pružate garanciju?</h3>
                <p className="text-muted-foreground">
                  Da, svi naši proizvodi dolaze sa najmanje 24 meseca garancije. Za više detalja o garanciji
                  za specifičan proizvod, molimo vas da pogledate stranicu proizvoda ili nas kontaktirajte.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
