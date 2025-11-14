import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    if (data) setUsers(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Users Management</h1>
        <p className="text-muted-foreground">View and manage registered users</p>
      </div>

      {users.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No users registered yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="p-6 hover-lift">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {(user.full_name || user.email || "U")[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{user.full_name || "Anonymous User"}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email || "No email"}</p>
                </div>
              </div>
              {user.phone && (
                <p className="text-sm text-muted-foreground mt-4">{user.phone}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
