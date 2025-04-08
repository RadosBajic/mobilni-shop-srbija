
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationType } from '@/types/banners';
import { NotificationService } from '@/services/NotificationService';
import { useToast } from '@/hooks/use-toast';

const NotificationsDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getNotifications();
      setNotifications(data);
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Load notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle clicking on a notification
  const handleNotificationClick = async (notification: NotificationType) => {
    // Mark as read
    if (!notification.read) {
      await NotificationService.markAsRead(notification.id);
      fetchNotifications();
    }

    // Navigate if there's a link
    if (notification.link) {
      navigate(notification.link);
    }

    // Close dropdown
    setOpen(false);
  };

  // Mark all as read
  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await NotificationService.markAllAsRead();
    fetchNotifications();
    toast({
      title: 'All notifications marked as read',
      description: 'You have no unread notifications',
    });
  };

  // Get badge color based on notification type
  const getBadgeVariant = (type: NotificationType['type']) => {
    switch (type) {
      case 'success': return 'outline';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'default';
    }
  };

  // Format date to relative time (e.g., "3 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs" 
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`cursor-pointer ${!notification.read ? 'font-medium bg-muted/50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2 w-full">
                  <Badge variant={getBadgeVariant(notification.type)} className="mt-0.5 h-2 w-2 rounded-full p-0" />
                  <div className="flex-1">
                    <div className="flex justify-between w-full">
                      <span className="font-medium">{notification.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(notification.date)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              No notifications
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
