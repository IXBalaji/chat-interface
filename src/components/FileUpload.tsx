import React, { useRef } from 'react';
import { Paperclip, Image, FileText, Music, Video } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      onClose();
    }
  };

  const fileTypes = [
    { icon: Image, label: 'Photos', accept: 'image/*', color: 'text-green-500' },
    { icon: FileText, label: 'Documents', accept: '.pdf,.doc,.docx,.txt', color: 'text-blue-500' },
    { icon: Music, label: 'Audio', accept: 'audio/*', color: 'text-purple-500' },
    { icon: Video, label: 'Videos', accept: 'video/*', color: 'text-red-500' },
  ];

  return (
    <div className="absolute bottom-16 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Attach file</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg"
        >
          ×
        </button>
      </div>
      <div className="space-y-2">
        {fileTypes.map((type, index) => (
          <button
            key={index}
            onClick={() => handleFileSelect(type.accept)}
            className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <type.icon size={20} className={type.color} />
            <span className="text-sm text-gray-700">{type.label}</span>
          </button>
        ))}
        <button
          onClick={() => handleFileSelect('*')}
          className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Paperclip size={20} className="text-gray-500" />
          <span className="text-sm text-gray-700">All files</span>
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;