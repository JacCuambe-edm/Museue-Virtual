import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/apiClient';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ label, value, onChange, placeholder, required }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [useUrl, setUseUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const data = await api.uploadImage(file);
      onChange(data.url); // Use the returned URL from the server
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Falha ao enviar a imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
      // Reset input value to allow selecting the same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {useUrl ? (
          <button 
            type="button" 
            onClick={() => setUseUrl(false)}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
          >
            <Upload className="w-3 h-3" /> Fazer Upload do PC
          </button>
        ) : (
          <button 
            type="button" 
            onClick={() => setUseUrl(true)}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" /> Usar Link URL (Secundário)
          </button>
        )}
      </div>

      {!useUrl ? (
        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center text-sm text-gray-500">
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mb-2"></div>
            ) : (
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
            )}
            {isUploading ? 'Enviando imagem...' : 'Clique ou arraste a imagem aqui para enviar'}
          </div>
        </div>
      ) : (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'https://exemplo.com/imagem.jpg'}
          className="w-full px-4 py-2 border-[0.5px] border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm bg-white"
        />
      )}

      {value && (
         <div className="mt-3 relative inline-block">
             <img src={value} alt="Preview" className="h-32 w-auto object-cover rounded-lg border-[0.5px] border-gray-200 shadow-sm" />
             <button
               type="button"
               onClick={() => onChange('')}
               className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 transition-colors shadow-sm"
               title="Remover imagem"
             >
               <X className="w-3 h-3" />
             </button>
         </div>
      )}
    </div>
  );
};
