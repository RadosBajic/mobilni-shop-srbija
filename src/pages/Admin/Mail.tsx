
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Send, Inbox, Archive, Trash, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailType {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  folder: 'inbox' | 'sent' | 'draft' | 'trash';
}

// Mock email data
const mockEmails: EmailType[] = [
  {
    id: '1',
    from: 'customer@example.com',
    to: 'shop@example.com',
    subject: 'Order Inquiry #12345',
    content: 'Hello, I would like to know the status of my order #12345. It has been a week since I placed it. Thank you.',
    date: '2023-04-05T10:30:00',
    read: false,
    folder: 'inbox'
  },
  {
    id: '2',
    from: 'support@supplier.com',
    to: 'shop@example.com',
    subject: 'New product catalog',
    content: 'Please find attached our new product catalog for Spring 2023.',
    date: '2023-04-04T15:22:00',
    read: true,
    folder: 'inbox'
  },
  {
    id: '3',
    from: 'shop@example.com',
    to: 'customer@example.com',
    subject: 'RE: Order Inquiry #12345',
    content: 'Your order has been shipped and should arrive within 2-3 business days. Thank you for your patience.',
    date: '2023-04-06T09:15:00',
    read: true,
    folder: 'sent'
  }
];

const Mail = () => {
  const { toast } = useToast();
  const [emails, setEmails] = useState<EmailType[]>(mockEmails);
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<EmailType | null>(null);
  const [composeMode, setComposeMode] = useState(false);
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    content: ''
  });

  const handleSendEmail = () => {
    if (!newEmail.to || !newEmail.subject || !newEmail.content) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const sentEmail: EmailType = {
      id: Date.now().toString(),
      from: 'shop@example.com',
      to: newEmail.to,
      subject: newEmail.subject,
      content: newEmail.content,
      date: new Date().toISOString(),
      read: true,
      folder: 'sent'
    };

    setEmails([...emails, sentEmail]);
    setNewEmail({ to: '', subject: '', content: '' });
    setComposeMode(false);
    
    toast({
      title: "Email sent",
      description: "Your email has been sent successfully"
    });
  };

  const markAsRead = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, read: true } : email
    ));
  };

  const moveToTrash = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, folder: 'trash' } : email
    ));
    
    setSelectedEmail(null);
    
    toast({
      title: "Email moved",
      description: "Email moved to trash"
    });
  };

  const filteredEmails = emails.filter(email => email.folder === activeTab);

  const handleEmailClick = (email: EmailType) => {
    if (!email.read) {
      markAsRead(email.id);
    }
    setSelectedEmail(email);
    setComposeMode(false);
  };

  const handleCompose = () => {
    setSelectedEmail(null);
    setComposeMode(true);
  };

  const handleReply = () => {
    if (!selectedEmail) return;
    
    setComposeMode(true);
    setNewEmail({
      to: selectedEmail.from,
      subject: `RE: ${selectedEmail.subject}`,
      content: `\n\n\n-------- Original Message --------\nFrom: ${selectedEmail.from}\nDate: ${new Date(selectedEmail.date).toLocaleString()}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.content}`
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mail Service</h1>
        <Button onClick={handleCompose}>
          <Edit className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[70vh]">
        <Card className="lg:col-span-1">
          <CardHeader className="p-4">
            <CardTitle>Folders</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              <Button 
                variant={activeTab === 'inbox' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('inbox')}
              >
                <Inbox className="mr-2 h-4 w-4" />
                Inbox
                <Badge className="ml-auto" variant="secondary">
                  {emails.filter(e => e.folder === 'inbox' && !e.read).length}
                </Badge>
              </Button>
              
              <Button 
                variant={activeTab === 'sent' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('sent')}
              >
                <Send className="mr-2 h-4 w-4" />
                Sent
              </Button>
              
              <Button 
                variant={activeTab === 'draft' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('draft')}
              >
                <Archive className="mr-2 h-4 w-4" />
                Drafts
              </Button>
              
              <Button 
                variant={activeTab === 'trash' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('trash')}
              >
                <Trash className="mr-2 h-4 w-4" />
                Trash
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 flex flex-col">
          {composeMode ? (
            <div className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>New Message</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Input 
                      placeholder="To" 
                      value={newEmail.to}
                      onChange={(e) => setNewEmail({...newEmail, to: e.target.value})}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Input 
                      placeholder="Subject" 
                      value={newEmail.subject}
                      onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Textarea 
                      className="min-h-[200px]"
                      placeholder="Compose your message..." 
                      value={newEmail.content}
                      onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline" onClick={() => setComposeMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendEmail}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </CardFooter>
            </div>
          ) : selectedEmail ? (
            <div className="flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedEmail.subject}</CardTitle>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={handleReply}>
                      Reply
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => moveToTrash(selectedEmail.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  From: {selectedEmail.from}
                  <br />
                  To: {selectedEmail.to}
                  <br />
                  Date: {new Date(selectedEmail.date).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto border-t pt-4">
                <div className="whitespace-pre-line">{selectedEmail.content}</div>
              </CardContent>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                {filteredEmails.length === 0 ? (
                  <div className="flex h-full items-center justify-center p-4 text-muted-foreground">
                    No emails in this folder
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredEmails.map((email) => (
                      <div 
                        key={email.id}
                        className={`p-3 hover:bg-muted cursor-pointer ${!email.read ? 'font-medium' : ''}`}
                        onClick={() => handleEmailClick(email)}
                      >
                        <div className="flex justify-between">
                          <span>{activeTab === 'sent' ? email.to : email.from}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(email.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="font-medium">{email.subject}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {email.content.substring(0, 100)}
                          {email.content.length > 100 ? '...' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Mail;
