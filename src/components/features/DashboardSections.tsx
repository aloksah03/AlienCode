import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardModal } from "@/components/ui/DashboardModal";
import { DashboardForm } from "@/components/ui/DashboardForm";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function DashboardSections() {
  const { user } = useAuth();
  const { folders, files, notes, teamMembers, loading } = useDashboard();
  const { toast } = useToast();
  const [activeModal, setActiveModal] = useState<'folder' | 'file' | 'note' | 'member' | null>(null);

  const openModal = (type: 'folder' | 'file' | 'note' | 'member') => {
    if (user?.isGuest) {
      toast({
        title: "Guest Access Restricted",
        description: "Please sign in to create items in your dashboard.",
        variant: "destructive",
      });
      return;
    }
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    // Convert Firestore timestamp to JS Date object
    let date;
    if (timestamp && typeof timestamp.toDate === 'function') {
      // It's a Firestore timestamp
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      // It's already a Date object
      date = timestamp;
    } else {
      // It's a plain object or other format
      date = new Date(timestamp);
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {/* My Files Section */}
      <Card className="glass-panel rounded-2xl border border-cyan-500/20">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-cyan-400 font-orbitron text-lg">MY FILES</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className={`border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs ${user?.isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => openModal('folder')}
                disabled={!!user?.isGuest}
              >
                New Folder
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={`border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs ${user?.isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => openModal('file')}
                disabled={!!user?.isGuest}
              >
                Add File
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : folders.length === 0 && files.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No files or folders yet</div>
          ) : (
            <div className="space-y-3">
              {folders.map(folder => (
                <div key={folder.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-cyan-500/10">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">📁</span>
                    <span className="text-sm font-medium">{folder.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(folder.createdAt)}</span>
                </div>
              ))}
              {files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-cyan-500/10">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">📄</span>
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{file.size} bytes</span>
                    <span>{formatDate(file.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Notes Section */}
      <Card className="glass-panel rounded-2xl border border-purple-500/20">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-purple-400 font-orbitron text-lg">MY NOTES</CardTitle>
            <Button
              size="sm"
              variant="outline"
              className={`border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs ${user?.isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => openModal('note')}
              disabled={!!user?.isGuest}
            >
              New Note
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : notes.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No notes yet</div>
          ) : (
            <div className="space-y-3">
              {notes.map(note => (
                <div key={note.id} className="p-3 rounded-lg bg-gray-800/30 border border-purple-500/10">
                  <h4 className="font-semibold text-sm mb-1 text-purple-300">{note.title}</h4>
                  {note.content && (
                    <p className="text-xs text-gray-400 line-clamp-2">{note.content}</p>
                  )}
                  <span className="text-xs text-gray-500 mt-1 block">{formatDate(note.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Members Section */}
      <Card className="glass-panel rounded-2xl border border-green-500/20">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-green-400 font-orbitron text-lg">TEAM MEMBERS</CardTitle>
            <Button
              size="sm"
              variant="outline"
              className={`border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs ${user?.isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => openModal('member')}
              disabled={!!user?.isGuest}
            >
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No team members yet</div>
          ) : (
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-green-500/10">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">👤</span>
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      {member.role && <div className="text-xs text-gray-500">{member.role}</div>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(member.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <DashboardModal
        isOpen={activeModal === 'folder'}
        onClose={closeModal}
        title="New Folder"
      >
        <DashboardForm
          type="folder"
          onSubmit={closeModal}
          onCancel={closeModal}
        />
      </DashboardModal>

      <DashboardModal
        isOpen={activeModal === 'file'}
        onClose={closeModal}
        title="Add File"
      >
        <DashboardForm
          type="file"
          onSubmit={closeModal}
          onCancel={closeModal}
        />
      </DashboardModal>

      <DashboardModal
        isOpen={activeModal === 'note'}
        onClose={closeModal}
        title="New Note"
      >
        <DashboardForm
          type="note"
          onSubmit={closeModal}
          onCancel={closeModal}
        />
      </DashboardModal>

      <DashboardModal
        isOpen={activeModal === 'member'}
        onClose={closeModal}
        title="Add Member"
      >
        <DashboardForm
          type="member"
          onSubmit={closeModal}
          onCancel={closeModal}
        />
      </DashboardModal>
    </div>
  );
}