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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Contact Messages</h1>
      <div className="space-y-4">
        {messages.map((msg) => (
          <Card key={msg.id} className="p-6">
            <div className="mb-2">
              <p className="font-bold">{msg.name}</p>
              <p className="text-sm text-muted-foreground">{msg.email}</p>
            </div>
            <p>{msg.message}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
