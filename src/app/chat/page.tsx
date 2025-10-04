'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { Loader2, Send } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { chatWithAi } from '@/ai/flows/chat-flow';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Message {
  text: string;
  isUser: boolean;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const avatarPlaceholder = PlaceHolderImages.find(p => p.id === 'user-avatar');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithAi({ query: input });
      const aiMessage: Message = { text: response.response, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error chatting with AI:', error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <PageHeader
        title="AI Chat"
        description="Chat with our AI assistant. Ask it anything!"
      />
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Conversation</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.isUser ? 'justify-end' : ''
                }`}
              >
                {!msg.isUser && (
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/bot-avatar.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-lg ${
                    msg.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                 {msg.isUser && user && (
                    <Avatar className="h-9 w-9">
                        <AvatarImage
                        src={user.photoURL || avatarPlaceholder?.imageUrl || ''}
                        alt={user.displayName || 'User'}
                        data-ai-hint={avatarPlaceholder?.imageHint}
                        />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                )}
              </div>
            ))}
             {loading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/bot-avatar.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>
        <div className="mt-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
