
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { EmailService, EmailSettings, EmailTemplate } from '@/services/EmailService';
import { Mail, Save, SendIcon, Code, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const EmailSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const emailSettings = await EmailService.loadSettings();
      setSettings(emailSettings);
      
      const emailTemplates = await EmailService.loadTemplates();
      setTemplates(emailTemplates);
      setLoading(false);
    };
    
    loadData();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setLoading(true);
    const success = await EmailService.saveSettings(settings);
    setLoading(false);
    
    if (success) {
      toast({
        title: 'Podešavanja sačuvana',
        description: 'Email podešavanja su uspešno sačuvana',
        variant: 'default',
      });
    } else {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom čuvanja podešavanja',
        variant: 'destructive',
      });
    }
  };
  
  const handleSettingChange = (field: keyof EmailSettings, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [field]: value
    });
  };
  
  const handleTestEmail = async () => {
    if (!testEmail || !settings) {
      toast({
        title: 'Greška',
        description: 'Unesite email adresu za testiranje',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      const success = await EmailService.sendEmail({
        to: testEmail,
        subject: 'Test email sa Vašeg sajta',
        body: `<h1>Test email</h1>
              <p>Ovo je test email sa vašeg sajta.</p>
              <p>Email podešavanja su ispravna i možete slati emailove.</p>
              <p>SMTP server: ${settings.smtpServer}</p>
              <p>SMTP port: ${settings.smtpPort}</p>
              <p>Username: ${settings.username}</p>`
      });
      
      if (success) {
        toast({
          title: 'Email poslat',
          description: `Test email je uspešno poslat na adresu ${testEmail}`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Greška',
          description: 'Došlo je do greške prilikom slanja test emaila',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom slanja test emaila',
        variant: 'destructive',
      });
      console.error('Error sending test email:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading && !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email podešavanja</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>SMTP Podešavanja</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Email Šabloni</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Podešavanja servera</CardTitle>
              <CardDescription>
                Konfigurišite podešavanja za slanje email poruka
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="smtpServer">SMTP Server</Label>
                      <Input 
                        id="smtpServer" 
                        value={settings.smtpServer}
                        onChange={(e) => handleSettingChange('smtpServer', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input 
                        id="smtpPort" 
                        type="number"
                        value={settings.smtpPort}
                        onChange={(e) => handleSettingChange('smtpPort', Number(e.target.value))}
                        placeholder="587"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="username">Korisničko ime</Label>
                      <Input 
                        id="username" 
                        value={settings.username}
                        onChange={(e) => handleSettingChange('username', e.target.value)}
                        placeholder="your-email@gmail.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Lozinka</Label>
                      <Input 
                        id="password" 
                        type="password"
                        value={settings.password}
                        onChange={(e) => handleSettingChange('password', e.target.value)}
                        placeholder="••••••••"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Za Gmail, možda će Vam trebati App Password umesto obične lozinke.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fromEmail">Email adresa za slanje (From)</Label>
                      <Input 
                        id="fromEmail" 
                        value={settings.fromEmail}
                        onChange={(e) => handleSettingChange('fromEmail', e.target.value)}
                        placeholder="your-store@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fromName">Ime pošiljaoca (From Name)</Label>
                      <Input 
                        id="fromName" 
                        value={settings.fromName}
                        onChange={(e) => handleSettingChange('fromName', e.target.value)}
                        placeholder="Your Store Name"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-6">
                      <Switch 
                        id="enableSSL"
                        checked={settings.enableSSL}
                        onCheckedChange={(checked) => handleSettingChange('enableSSL', checked)}
                      />
                      <Label htmlFor="enableSSL">Koristi SSL/TLS</Label>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <Label htmlFor="testEmail">Test email adresa</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="testEmail" 
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          placeholder="test@example.com"
                        />
                        <Button 
                          onClick={handleTestEmail}
                          disabled={isSending}
                        >
                          {isSending ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              <span>Slanje...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <SendIcon className="h-4 w-4" />
                              <span>Pošalji test</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button 
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Sačuvaj podešavanja
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Email Šabloni</CardTitle>
              <CardDescription>
                Pregledajte i izmenite email šablone
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length > 0 ? (
                <div className="space-y-6">
                  {templates.map(template => (
                    <div key={template.id} className="border rounded-md p-4">
                      <h3 className="text-lg font-medium mb-2">
                        {template.name === 'order_confirmation' 
                          ? 'Potvrda porudžbine' 
                          : template.name === 'shipping_confirmation' 
                          ? 'Potvrda slanja'
                          : template.name}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Label>Naslov</Label>
                          <Input defaultValue={template.subject} disabled />
                        </div>
                        <div>
                          <Label>Sadržaj</Label>
                          <Textarea 
                            className="font-mono text-sm h-32" 
                            defaultValue={template.body}
                            disabled
                          />
                        </div>
                        <div>
                          <Label>Dostupne promenljive</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {template.variables.map(variable => (
                              <div key={variable} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                <Code className="h-3 w-3" />
                                {`{${variable}}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  Nema dostupnih email šablona
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailSettingsPage;
