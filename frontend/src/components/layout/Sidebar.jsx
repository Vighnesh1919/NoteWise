import { useEffect, useState } from "react";
import { noteService } from "../../services/noteService";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import SidebarHeader from "./components/SidebarHeader";
import SidebarSearch from "./components/SidebarSearch";
import SidebarList from "./components/SidebarList";
import SidebarFooter from "./components/SidebarFooter";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Star, Trash2 } from "lucide-react";

export default function Sidebar({ onOpenNote }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("notes");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const data = await noteService.getAll();
    setNotes(data);
    setLoading(false);
  };

  const handleNew = async () => {
    const note = await noteService.create();
    setNotes((prev) => [note, ...prev]);
    onOpenNote(note);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await noteService.remove(id);
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_deleted: true } : n)),
    );
  };

  const handleRestore = async (e, id) => {
    e.stopPropagation();
    await noteService.restore(id);
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_deleted: false } : n)),
    );
  };

  const handleFavorite = async (e, id) => {
    e.stopPropagation();
    const res = await noteService.toggleFavorite(id);
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_favorite: res.is_favorite } : n,
      ),
    );
  };
  
    const handleHardDelete = async (e, id) => {
      e.stopPropagation();
      await noteService.hardDelete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    };
 

  const fuzzyMatch = (text, query) => {
    text = text.toLowerCase();
    query = query.toLowerCase();
    let i = 0,
      j = 0;
    while (i < text.length && j < query.length) {
      if (text[i] === query[j]) j++;
      i++;
    }
    return j === query.length;
  };

  const filtered = notes
    .filter((n) => {
      if (tab === "notes") return !n.is_deleted;
      if (tab === "favorites") return n.is_favorite && !n.is_deleted;
      if (tab === "trash") return n.is_deleted;
    })
    .filter((n) => fuzzyMatch(n.title || "", search));

  return (
    <aside className="w-72 h-screen flex flex-col bg-white/80 backdrop-blur-xl border-r border-gray-200">
      {/* Header */}
      <div className="px-6 py-5">
        <SidebarHeader />
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <SidebarSearch search={search} setSearch={setSearch} />
      </div>

      {/* Tabs */}
      <div className="px-3 space-y-1 text-sm">
        <button
          onClick={() => setTab("notes")}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-md ${tab === "notes" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`}
        >
          <FileText size={16} /> Notes
        </button>

        <button
          onClick={() => setTab("favorites")}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-md ${tab === "favorites" ? "bg-yellow-50 text-yellow-600" : "hover:bg-gray-100 text-gray-600"}`}
        >
          <Star size={16} /> Favorites
        </button>

        <button
          onClick={() => setTab("trash")}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-md ${tab === "trash" ? "bg-red-50 text-red-600" : "hover:bg-gray-100 text-gray-600"}`}
        >
          <Trash2 size={16} /> Trash
        </button>
      </div>

      <Separator className="my-3" />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ FIXED HEADER (NOT SCROLLING) */}
        {tab === "notes" && (
          <div className="flex justify-between items-center px-4 py-2">
            <span className="text-xs text-gray-400 uppercase">Notes</span>
            <button
              onClick={handleNew}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition"
            >
              + New
            </button>
          </div>
        )}

        {/* 🔄 SCROLLABLE NOTES */}
        <ScrollArea className="h-full px-3">
          <SidebarList
            tab={tab}
            notes={filtered}
            loading={loading}
            onOpen={onOpenNote}
            onDelete={handleDelete}
             onHardDelete={handleHardDelete}
            onFavorite={handleFavorite}
            onRestore={handleRestore}
          />
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200">
        <SidebarFooter logout={logout} navigate={navigate} />
      </div>
    </aside>
  );
}
