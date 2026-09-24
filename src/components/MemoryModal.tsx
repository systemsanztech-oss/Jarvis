import React, { useState } from 'react';
import { Brain, X, Plus, Search, Trash2, Tag } from 'lucide-react';
import { MemoryFact } from '../types';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  facts: MemoryFact[];
  onAddFact: (category: string, key: string, value: string) => Promise<void>;
  onDeleteFact: (id: string) => Promise<void>;
  accentColor: string;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  facts,
  onAddFact,
  onDeleteFact,
  accentColor,
}) => {
  const [search, setSearch] = useState('');
  const [newCategory, setNewCategory] = useState('preferences');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const filteredFacts = facts.filter(
    (f) =>
      f.key.toLowerCase().includes(search.toLowerCase()) ||
      f.value.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    await onAddFact(newCategory, newKey.trim(), newValue.trim());
    setNewKey('');
    setNewValue('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-[#010f18] border border-[#1a5c7a] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#0d3347] bg-[#000d14]">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" style={{ color: accentColor }} />
            <span className="font-mono font-bold text-sm tracking-widest text-[#8ffcff] uppercase">
              JARVIS MEMORY VAULT // RECALLABLE STORAGE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#3a8a9a] hover:text-[#ff3355] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-3 border-b border-[#0d3347] flex items-center gap-2 bg-[#011520]/60">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#3a8a9a]" />
            <input
              type="text"
              placeholder="Search recalled memories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#000d14] border border-[#0d3347] rounded text-[#8ffcff] placeholder-[#3a8a9a] focus:outline-none focus:border-[#00d4ff]"
            />
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono bg-[#002f47] border border-[#1a5c7a] text-[#8ffcff] hover:bg-[#003d5c] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAdding ? 'CANCEL' : 'ADD FACT'}
          </button>
        </div>

        {/* Add Memory Form */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="p-3 border-b border-[#0d3347] bg-[#001f2e]/40 flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="text-xs bg-[#000d14] border border-[#0d3347] rounded p-1.5 text-[#8ffcff]"
              >
                <option value="identity">Identity</option>
                <option value="preferences">Preferences</option>
                <option value="projects">Projects</option>
                <option value="relationships">Relationships</option>
                <option value="notes">Notes</option>
              </select>
              <input
                type="text"
                placeholder="Key (e.g. coffee_pref)"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="text-xs bg-[#000d14] border border-[#0d3347] rounded p-1.5 text-[#8ffcff]"
              />
              <input
                type="text"
                placeholder="Value (e.g. Black Espresso)"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="text-xs bg-[#000d14] border border-[#0d3347] rounded p-1.5 text-[#8ffcff]"
              />
            </div>
            <button
              type="submit"
              className="self-end px-3 py-1 rounded text-xs font-mono font-semibold"
              style={{ backgroundColor: accentColor, color: '#00060a' }}
            >
              STORE FACT
            </button>
          </form>
        )}

        {/* List of Facts */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {filteredFacts.length === 0 ? (
            <div className="text-center py-8 text-[#3a8a9a] text-xs font-mono">
              NO MEMORY ENTRIES MATCH QUERY.
            </div>
          ) : (
            filteredFacts.map((fact) => (
              <div
                key={fact.id}
                className="flex items-center justify-between p-2.5 rounded bg-[#000d14] border border-[#0d3347] hover:border-[#1a5c7a] transition-colors"
              >
                <div className="flex flex-col gap-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#002f47] text-[#8ffcff] border border-[#0d3347]">
                      {fact.category}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#8ffcff] truncate">
                      {fact.key}
                    </span>
                  </div>
                  <span className="text-xs text-[#d8f8ff] break-words">{fact.value}</span>
                </div>
                <button
                  onClick={() => onDeleteFact(fact.id)}
                  className="p-1.5 text-[#3a8a9a] hover:text-[#ff3355] rounded hover:bg-[#ff3355]/10 transition-colors"
                  title="Forget this fact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#0d3347] bg-[#000d14] text-[11px] font-mono text-[#3a8a9a] flex items-center justify-between">
          <span>{facts.length} FACTS COMMITTED TO MEMORY</span>
          <span>AUTONOMOUS LOCAL RECALL</span>
        </div>
      </div>
    </div>
  );
};
