import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "./useAuth";
import { Folder as FolderType, FileItem as FileType, Note as NoteType, TeamMember as TeamMemberType } from "@/types";

export function useDashboard() {
  const { user } = useAuth();
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data for the current user
  useEffect(() => {
    if (!user || user.isGuest) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch folders
        const foldersQuery = query(
          collection(db, `users/${user.id}/folders`),
          orderBy('createdAt', 'desc')
        );
        const foldersSnapshot = await getDocs(foldersQuery);
        const foldersData = foldersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            createdAt: data.createdAt
          } as FolderType;
        });
        setFolders(foldersData);

        // Fetch files
        const filesQuery = query(
          collection(db, `users/${user.id}/files`),
          orderBy('createdAt', 'desc')
        );
        const filesSnapshot = await getDocs(filesQuery);
        const filesData = filesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            folderId: data.folderId,
            size: data.size,
            createdAt: data.createdAt
          } as FileType;
        });
        setFiles(filesData);

        // Fetch notes
        const notesQuery = query(
          collection(db, `users/${user.id}/notes`),
          orderBy('createdAt', 'desc')
        );
        const notesSnapshot = await getDocs(notesQuery);
        const notesData = notesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            createdAt: data.createdAt
          } as NoteType;
        });
        setNotes(notesData);

        // Fetch team members
        const teamMembersQuery = query(
          collection(db, `users/${user.id}/teamMembers`),
          orderBy('createdAt', 'desc')
        );
        const teamMembersSnapshot = await getDocs(teamMembersQuery);
        const teamMembersData = teamMembersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            role: data.role,
            createdAt: data.createdAt
          } as TeamMemberType;
        });
        setTeamMembers(teamMembersData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Folders operations
  const createFolder = async (name: string) => {
    if (!user || user.isGuest) return null;
    
    try {
      const docRef = await addDoc(collection(db, `users/${user.id}/folders`), {
        name,
        createdAt: serverTimestamp(),
      });
      
      const newFolder: FolderType = {
        id: docRef.id,
        name,
        createdAt: serverTimestamp() as unknown as Date,
      };
      
      setFolders(prev => [newFolder, ...prev]);
      return newFolder;
    } catch (error) {
      console.error("Error creating folder:", error);
      throw error;
    }
  };

  // Files operations
  const createFile = async (name: string, folderId?: string, size: number = 0) => {
    if (!user || user.isGuest) return null;
    
    try {
      const docRef = await addDoc(collection(db, `users/${user.id}/files`), {
        name,
        folderId: folderId || null,
        size,
        createdAt: serverTimestamp(),
      });
      
      const newFile: FileType = {
        id: docRef.id,
        name,
        folderId: folderId || undefined,
        size,
        createdAt: serverTimestamp() as unknown as Date,
      };
      
      setFiles(prev => [newFile, ...prev]);
      return newFile;
    } catch (error) {
      console.error("Error creating file:", error);
      throw error;
    }
  };

  // Notes operations
  const createNote = async (title: string, content?: string) => {
    if (!user || user.isGuest) return null;
    
    try {
      const docRef = await addDoc(collection(db, `users/${user.id}/notes`), {
        title,
        content: content || "",
        createdAt: serverTimestamp(),
      });
      
      const newNote: NoteType = {
        id: docRef.id,
        title,
        content: content || "",
        createdAt: serverTimestamp() as unknown as Date,
      };
      
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  };

  // Team members operations
  const addTeamMember = async (name: string, role?: string) => {
    if (!user || user.isGuest) return null;
    
    try {
      const docRef = await addDoc(collection(db, `users/${user.id}/teamMembers`), {
        name,
        role: role || "",
        createdAt: serverTimestamp(),
      });
      
      const newMember: TeamMemberType = {
        id: docRef.id,
        name,
        role: role || "",
        createdAt: serverTimestamp() as unknown as Date,
      };
      
      setTeamMembers(prev => [newMember, ...prev]);
      return newMember;
    } catch (error) {
      console.error("Error adding team member:", error);
      throw error;
    }
  };

  return {
    folders,
    files,
    notes,
    teamMembers,
    loading,
    createFolder,
    createFile,
    createNote,
    addTeamMember,
  };
}