import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Trash2, Star, StarOff, Bold, Italic, List, CheckSquare, AlignLeft, Calendar, Tag, Menu, X, Zap, Palette, Link2, Hash, Clock, TrendingUp, Sparkles } from 'lucide-react';

export default function NotesApp() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Bienvenue dans Notes',
      content: 'Cette application offre une expérience d\'écriture riche et intuitive. Essayez les outils de mise en forme !',
      isFavorite: true,
      tags: ['important'],
      color: 'blue',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: 0,
      readTime: 0
    }
  ]);
  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const contentRef = useRef(null);

  const colors = [
    { name: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', accent: 'bg-blue-500' },
    { name: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', accent: 'bg-purple-500' },
    { name: 'pink', bg: 'bg-pink-50', border: 'border-pink-200', accent: 'bg-pink-500' },
    { name: 'green', bg: 'bg-green-50', border: 'border-green-200', accent: 'bg-green-500' },
    { name: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', accent: 'bg-yellow-500' },
    { name: 'orange', bg: 'bg-orange-50', border: 'border-orange-200', accent: 'bg-orange-500' },
    { name: 'gray', bg: 'bg-gray-50', border: 'border-gray-200', accent: 'bg-gray-500' },
  ];

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Nouvelle note',
      content: '',
      isFavorite: false,
      tags: [],
      color: 'blue',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: 0,
      readTime: 0
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const calculateStats = (content) => {
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const readTime = Math.ceil(wordCount / 200); // 200 mots par minute
    return { wordCount, readTime };
  };

  const updateNote = (id, updates) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
    ));
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, ...updates });
    }
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    if (selectedNote?.id === id) {
      setSelectedNote(newNotes[0] || null);
    }
  };

  const toggleFavorite = (id) => {
    const note = notes.find(n => n.id === id);
    updateNote(id, { isFavorite: !note.isFavorite });
  };

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
    contentRef.current?.focus();
  };

  const insertList = (ordered) => {
    document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList', false, null);
    contentRef.current?.focus();
  };

  const handleContentChange = (e) => {
    if (selectedNote) {
      const content = e.target.innerHTML;
      const stats = calculateStats(content);
      updateNote(selectedNote.id, { content, ...stats });
    }
  };

  const addQuickTag = () => {
    const tag = prompt('Ajouter un tag:');
    if (tag && selectedNote) {
      const newTags = [...selectedNote.tags, tag.trim()];
      updateNote(selectedNote.id, { tags: newTags });
    }
  };

  const generateSummary = () => {
    if (selectedNote && selectedNote.content) {
      const text = selectedNote.content.replace(/<[^>]*>/g, '');
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const summary = sentences.slice(0, 2).join('. ') + '.';
      alert('Résumé auto-généré:\n\n' + summary);
    }
  };

  const changeNoteColor = (color) => {
    if (selectedNote) {
      updateNote(selectedNote.id, { color });
      setShowColorPicker(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getCurrentColor = () => {
    return colors.find(c => c.name === (selectedNote?.color || 'blue'));
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col overflow-hidden shadow-xl`}>
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Notes</h1>
            <button
              onClick={createNewNote}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher vos notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Aucune note trouvée</p>
            </div>
          ) : (
            filteredNotes.map(note => {
              const noteColor = colors.find(c => c.name === note.color);
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] border-2 ${
                    selectedNote?.id === note.id 
                      ? `${noteColor.bg} ${noteColor.border} shadow-lg` 
                      : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-800 text-base truncate flex-1">
                      {note.title}
                    </h3>
                    {note.isFavorite && (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(note.updatedAt)}
                  </p>
                  <p 
                    className="text-sm text-gray-600 line-clamp-2 mb-3"
                    dangerouslySetInnerHTML={{ __html: note.content || 'Aucun contenu' }}
                  />
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, i) => (
                        <span key={i} className={`px-3 py-1 ${noteColor.accent} text-white rounded-full text-xs font-medium`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-4 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {selectedNote && (
            <>
              <div className="w-px h-8 bg-gray-200" />
              
              <button
                onClick={() => applyFormat('bold')}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
                title="Gras (Ctrl+B)"
              >
                <Bold className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => applyFormat('italic')}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
                title="Italique (Ctrl+I)"
              >
                <Italic className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => applyFormat('underline')}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 font-bold text-sm"
                title="Souligné (Ctrl+U)"
              >
                U
              </button>

              <div className="w-px h-8 bg-gray-200" />
              
              <button
                onClick={() => insertList(false)}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
                title="Liste à puces"
              >
                <List className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => insertList(true)}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
                title="Liste numérotée"
              >
                <AlignLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => applyFormat('insertUnorderedList')}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
                title="Liste de tâches"
              >
                <CheckSquare className="w-5 h-5" />
              </button>

              <div className="w-px h-8 bg-gray-200" />

              {/* Fonctionnalités innovantes */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
                  title="Changer la couleur"
                >
                  <Palette className="w-5 h-5" />
                </button>
                {showColorPicker && (
                  <div className="absolute top-full mt-2 bg-white rounded-2xl shadow-xl p-3 flex gap-2 z-10 border border-gray-200">
                    {colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => changeNoteColor(color.name)}
                        className={`w-8 h-8 rounded-full ${color.accent} hover:scale-110 transition-transform ${selectedNote.color === color.name ? 'ring-2 ring-gray-800 ring-offset-2' : ''}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={addQuickTag}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
                title="Ajouter un tag"
              >
                <Hash className="w-5 h-5" />
              </button>

              <button
                onClick={generateSummary}
                className="p-3 hover:bg-purple-100 text-purple-600 rounded-xl transition-all hover:scale-105"
                title="Générer un résumé"
              >
                <Zap className="w-5 h-5" />
              </button>

              <div className="flex-1" />

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500 px-3">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {selectedNote.wordCount} mots
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedNote.readTime} min
                </span>
              </div>
              
              <button
                onClick={() => toggleFavorite(selectedNote.id)}
                className="p-3 hover:bg-yellow-100 rounded-xl transition-all hover:scale-105"
                title={selectedNote.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {selectedNote.isFavorite ? (
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ) : (
                  <StarOff className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              <button
                onClick={() => deleteNote(selectedNote.id)}
                className="p-3 hover:bg-red-100 text-red-600 rounded-xl transition-all hover:scale-105"
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Editor */}
        {selectedNote ? (
          <div className={`flex-1 overflow-y-auto p-12 ${getCurrentColor().bg}`}>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-12 border-2 border-gray-100">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                className="w-full text-4xl font-bold mb-4 focus:outline-none text-gray-800 bg-transparent"
                placeholder="Titre de la note"
              />
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedNote.updatedAt)}</span>
                </div>
                {selectedNote.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <div className="flex gap-2">
                      {selectedNote.tags.map((tag, i) => (
                        <span key={i} className={`px-3 py-1 ${getCurrentColor().accent} text-white rounded-full text-xs font-medium`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div
                ref={contentRef}
                contentEditable
                onInput={handleContentChange}
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                className="prose prose-lg max-w-none focus:outline-none text-gray-700 leading-relaxed min-h-[400px]"
                style={{ 
                  wordBreak: 'break-word',
                  unicodeBidi: 'plaintext'
                }}
                placeholder="Commencez à écrire..."
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <p className="text-2xl font-bold text-gray-800 mb-2">Aucune note sélectionnée</p>
              <p className="text-gray-500">Créez une nouvelle note ou sélectionnez-en une</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}