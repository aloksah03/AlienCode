import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function DashboardModal({ isOpen, onClose, title, children }: DashboardModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-panel border border-cyan-500/30 bg-gray-900/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 font-orbitron text-lg">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}