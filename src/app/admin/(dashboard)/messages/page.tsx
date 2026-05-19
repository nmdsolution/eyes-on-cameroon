import { createAdminClient } from "@/lib/supabase/admin";
import { MessageSquare } from "lucide-react";

export const metadata = { title: "Messages — Admin" };

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

export default async function MessagesPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  const messages: Message[] = data ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-500 text-sm mt-1">{messages.length} total</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={18} className="text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{msg.name}</span>
                    <span className="text-gray-400 text-sm">&lt;{msg.email}&gt;</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  {msg.subject && (
                    <p className="text-sm font-medium text-gray-700 mb-2">{msg.subject}</p>
                  )}
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
