import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Contact Messages</h1>
        <p className="text-muted-foreground">View customer inquiries and support requests</p>
      </div>

      {messages.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No messages yet</p>
          <p className="text-sm text-muted-foreground mt-2">Customer messages will appear here</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className="p-6 hover-lift">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="space-y-1">
                  <p className="font-bold text-lg">{msg.name}</p>
                  <p className="text-sm text-muted-foreground">{msg.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.created_at).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{msg.message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
