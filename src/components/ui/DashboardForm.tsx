import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";

interface DashboardFormProps {
  type: 'folder' | 'file' | 'note' | 'member';
  onSubmit: () => void;
  onCancel: () => void;
}

export function DashboardForm({ type, onSubmit, onCancel }: DashboardFormProps) {
  const { user } = useAuth();
  const { createFolder, createFile, createNote, addTeamMember } = useDashboard();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    folderId: '',
    size: 0,
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user?.isGuest) {
      setError('Guest users cannot create items. Please sign in.');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      switch (type) {
        case 'folder':
          if (!formData.name.trim()) {
            setError('Name is required');
            return;
          }
          await createFolder(formData.name);
          break;
          
        case 'file':
          if (!formData.name.trim()) {
            setError('Name is required');
            return;
          }
          await createFile(formData.name, formData.folderId || undefined, Number(formData.size));
          break;
          
        case 'note':
          if (!formData.title.trim()) {
            setError('Title is required');
            return;
          }
          await createNote(formData.title, formData.content);
          break;
          
        case 'member':
          if (!formData.name.trim()) {
            setError('Name is required');
            return;
          }
          await addTeamMember(formData.name, formData.role);
          break;
      }
      
      onSubmit();
      setFormData({
        name: '',
        title: '',
        content: '',
        folderId: '',
        size: 0,
        role: ''
      });
    } catch (err) {
      setError('Failed to create item. Please try again.');
      console.error(`Error creating ${type}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'folder': return 'New Folder';
      case 'file': return 'Add File';
      case 'note': return 'New Note';
      case 'member': return 'Add Member';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(type === 'folder' || type === 'member') && (
        <div>
          <Label htmlFor="name" className="text-cyan-300 font-orbitron text-sm">
            Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={`Enter ${type === 'folder' ? 'folder' : 'member'} name`}
            className="bg-gray-800/50 border-cyan-500/30 text-white"
            disabled={!!user?.isGuest}
          />
        </div>
      )}

      {type === 'file' && (
        <>
          <div>
            <Label htmlFor="name" className="text-cyan-300 font-orbitron text-sm">
              File Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter file name"
              className="bg-gray-800/50 border-cyan-500/30 text-white"
              disabled={!!user?.isGuest}
            />
          </div>
          <div>
            <Label htmlFor="folderId" className="text-cyan-300 font-orbitron text-sm">
              Folder ID
            </Label>
            <Input
              id="folderId"
              name="folderId"
              value={formData.folderId}
              onChange={handleChange}
              placeholder="Enter folder ID (optional)"
              className="bg-gray-800/50 border-cyan-500/30 text-white"
              disabled={!!user?.isGuest}
            />
          </div>
          <div>
            <Label htmlFor="size" className="text-cyan-300 font-orbitron text-sm">
              Size (bytes)
            </Label>
            <Input
              id="size"
              name="size"
              type="number"
              value={formData.size}
              onChange={handleChange}
              placeholder="Enter file size"
              className="bg-gray-800/50 border-cyan-500/30 text-white"
              disabled={!!user?.isGuest}
            />
          </div>
        </>
      )}

      {type === 'note' && (
        <>
          <div>
            <Label htmlFor="title" className="text-cyan-300 font-orbitron text-sm">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter note title"
              className="bg-gray-800/50 border-cyan-500/30 text-white"
              disabled={!!user?.isGuest}
            />
          </div>
          <div>
            <Label htmlFor="content" className="text-cyan-300 font-orbitron text-sm">
              Content
            </Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter note content (optional)"
              rows={4}
              className="bg-gray-800/50 border-cyan-500/30 text-white"
              disabled={!!user?.isGuest}
            />
          </div>
        </>
      )}

      {type === 'member' && (
        <div>
          <Label htmlFor="role" className="text-cyan-300 font-orbitron text-sm">
            Role
          </Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Enter role (optional)"
            className="bg-gray-800/50 border-cyan-500/30 text-white"
            disabled={!!user?.isGuest}
          />
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm font-orbitron">{error}</div>
      )}

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
          disabled={loading || !!user?.isGuest}
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
}