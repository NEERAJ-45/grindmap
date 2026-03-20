"use client";

import { useState } from "react";
import { type SDTopic, type SDItem, type UserSDItem } from "@prisma/client";
import { 
  createSDTopic, 
  updateSDTopic, 
  deleteSDTopic,
  addSDItems,
  updateSDItem,
  deleteSDItem
} from "@/app/actions/sd-actions";
import { Plus, Trash2, Edit2, ChevronDown, CheckCircle2, ChevronRight, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

type TopicWithItems = SDTopic & { items: (SDItem & { users: UserSDItem[] })[] };

export function AdminSDClient({ initialTopics }: { initialTopics: TopicWithItems[] }) {
  const [topics, setTopics] = useState<TopicWithItems[]>(initialTopics);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  // New Topic State
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicSlug, setNewTopicSlug] = useState("");
  const [newTopicDesc, setNewTopicDesc] = useState("");

  // Editing State
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicForm, setEditTopicForm] = useState({ name: "", slug: "", description: "" });

  const [loading, setLoading] = useState(false);

  // New Item State (Inside Topic)
  const [addingItemToTopic, setAddingItemToTopic] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");
  const [newItemType, setNewItemType] = useState("Article");
  const [newItemDiff, setNewItemDiff] = useState("Medium");

  const handleCreateTopic = async () => {
    if (!newTopicName || !newTopicSlug) return;
    setLoading(true);
    const created = await createSDTopic({
      name: newTopicName,
      slug: newTopicSlug,
      description: newTopicDesc,
      icon: "📚",
      order: topics.length,
    });
    setTopics([...topics, { ...created, items: [] }]);
    setIsAddingTopic(false);
    setNewTopicName("");
    setNewTopicSlug("");
    setNewTopicDesc("");
    setLoading(false);
  };

  const handleUpdateTopic = async (id: string) => {
    setLoading(true);
    const updated = await updateSDTopic(id, editTopicForm);
    setTopics(topics.map(t => t.id === id ? { ...t, ...updated } : t));
    setEditingTopicId(null);
    setLoading(false);
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm("Delete this topic AND all its items?")) return;
    setLoading(true);
    await deleteSDTopic(id);
    setTopics(topics.filter(t => t.id !== id));
    setLoading(false);
  };

  const handleAddItem = async (topicId: string) => {
    if (!newItemTitle || !newItemUrl) return;
    setLoading(true);
    await addSDItems(topicId, [{
      title: newItemTitle,
      url: newItemUrl,
      type: newItemType,
      difficulty: newItemDiff,
    }]);
    
    // Quick refresh of the page or optimistic update.
    // For simplicity, we just trigger a hard refresh to get nested joins
    window.location.reload();
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Delete item?")) return;
    setLoading(true);
    await deleteSDItem(itemId);
    setTopics(topics.map(t => ({
      ...t,
      items: t.items.filter(i => i.id !== itemId)
    })));
    setLoading(false);
  };

  return (
    <div className="space-y-6 text-[#ededed]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Topics & Resources</h2>
        <button
          onClick={() => setIsAddingTopic(true)}
          className="flex items-center gap-2 rounded bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563eb]"
        >
          <Plus size={16} /> New Topic
        </button>
      </div>

      {isAddingTopic && (
        <div className="rounded-lg border border-[#333] bg-[#1a1a1a] p-4 text-sm mb-6">
          <div className="grid gap-4 md:grid-cols-3">
            <input
              className="rounded bg-[#111] px-3 py-2 border border-[#333] outline-none focus:border-[#3b82f6]"
              placeholder="Topic Name"
              value={newTopicName}
              onChange={e => {
                setNewTopicName(e.target.value);
                setNewTopicSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
              }}
            />
            <input
              className="rounded bg-[#111] px-3 py-2 border border-[#333] outline-none focus:border-[#3b82f6]"
              placeholder="Slug"
              value={newTopicSlug}
              onChange={e => setNewTopicSlug(e.target.value)}
            />
            <input
              className="rounded bg-[#111] px-3 py-2 border border-[#333] outline-none focus:border-[#3b82f6]"
              placeholder="Description"
              value={newTopicDesc}
              onChange={e => setNewTopicDesc(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setIsAddingTopic(false)} className="px-3 py-1.5 text-[#8b92a0]">Cancel</button>
            <button onClick={handleCreateTopic} disabled={loading} className="bg-[#22c55e] text-[#111] px-4 py-1.5 rounded font-medium">Save Topic</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {topics.map(topic => (
          <div key={topic.id} className="rounded-lg border border-[#1f1f1f] bg-[#111] overflow-hidden">
            {/* Topic Header Row */}
            <div className="flex items-center justify-between p-4 bg-[#0d0d0d] border-b border-[#1f1f1f]">
              {editingTopicId === topic.id ? (
                <div className="flex flex-1 items-center gap-3">
                  <input
                    className="rounded bg-[#1a1a1a] px-2 py-1 border border-[#333] text-sm"
                    value={editTopicForm.name}
                    onChange={e => setEditTopicForm({...editTopicForm, name: e.target.value})}
                  />
                  <input
                    className="rounded bg-[#1a1a1a] px-2 py-1 border border-[#333] text-sm"
                    value={editTopicForm.slug}
                    onChange={e => setEditTopicForm({...editTopicForm, slug: e.target.value})}
                  />
                  <button onClick={() => handleUpdateTopic(topic.id)} className="p-1.5 bg-[#22c55e] text-[#111] rounded">
                    <Save size={16} />
                  </button>
                  <button onClick={() => setEditingTopicId(null)} className="p-1.5 text-[#ef4444] rounded hover:bg-[#ef4444]/10">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  className="flex flex-1 items-center gap-3 cursor-pointer select-none"
                  onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                >
                  {expandedTopic === topic.id ? <ChevronDown size={18} className="text-[#6b7280]"/> : <ChevronRight size={18} className="text-[#6b7280]"/>}
                  <span className="font-medium text-[15px]">{topic.name}</span>
                  <span className="text-xs text-[#6b7280]">/{topic.slug}</span>
                  <span className="ml-2 rounded-full bg-[#1a1a1a] px-2 py-0.5 text-xs text-[#8b92a0] border border-[#222]">
                    {topic.items.length} items
                  </span>
                </div>
              )}
              
              {!editingTopicId && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setEditTopicForm({ name: topic.name, slug: topic.slug, description: topic.description || "" });
                      setEditingTopicId(topic.id);
                    }} 
                    className="p-1.5 text-[#6b7280] hover:text-[#ededed]"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteTopic(topic.id)} className="p-1.5 text-[#ef4444] hover:bg-[#ef4444]/10 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Expanded Items */}
            {expandedTopic === topic.id && (
              <div className="p-4 bg-[#111] space-y-3">
                {topic.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded bg-[#1a1a1a] border border-[#222]">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm text-[#ededed]">{item.title}</span>
                      <span className="text-xs text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded uppercase">{item.type}</span>
                      <span className="text-xs text-[#eab308] bg-[#eab308]/10 px-2 py-0.5 rounded">{item.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={item.url} target="_blank" className="text-xs text-[#8b92a0] hover:text-[#3b82f6] hover:underline truncate max-w-[200px] block">
                        {item.url}
                      </a>
                      <button onClick={() => handleDeleteItem(item.id)} className="text-[#6b7280] hover:text-[#ef4444]">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Item Form */}
                {addingItemToTopic === topic.id ? (
                  <div className="mt-4 p-3 bg-[#1a1a1a] rounded border border-[#3b82f6]/30 flex gap-2 items-center">
                    <input className="flex-1 rounded bg-[#111] border border-[#333] px-2 py-1 text-sm outline-none" placeholder="Title" value={newItemTitle} onChange={e=>setNewItemTitle(e.target.value)} />
                    <input className="flex-1 rounded bg-[#111] border border-[#333] px-2 py-1 text-sm outline-none" placeholder="URL" value={newItemUrl} onChange={e=>setNewItemUrl(e.target.value)} />
                    <select className="bg-[#111] border border-[#333] rounded px-2 py-1 text-sm" value={newItemType} onChange={e=>setNewItemType(e.target.value)}>
                      <option>Article</option><option>Video</option><option>Paper</option>
                    </select>
                    <select className="bg-[#111] border border-[#333] rounded px-2 py-1 text-sm" value={newItemDiff} onChange={e=>setNewItemDiff(e.target.value)}>
                      <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                    <button onClick={() => handleAddItem(topic.id)} className="bg-[#3b82f6] text-white px-3 py-1 rounded text-sm font-medium">Add</button>
                    <button onClick={() => setAddingItemToTopic(null)} className="text-[#8b92a0] px-2 py-1 text-sm hover:text-white">Cancel</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setAddingItemToTopic(topic.id)}
                    className="mt-2 text-sm text-[#8b92a0] hover:text-[#ededed] flex items-center gap-1.5 px-2 py-1 border border-dashed border-[#333] rounded hover:border-[#666] transition-colors"
                  >
                    <Plus size={14} /> Add new resource
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
