import React from 'react';
import { Plus, X } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

interface DynamicGalleryFieldProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const DynamicGalleryField: React.FC<DynamicGalleryFieldProps> = ({ images, onChange }) => {
  const handleAddImage = () => {
    onChange([...images, '']);
  };

  const handleUpdateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    onChange(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Galeria de Imagens Adicionais</label>
      </div>

      <div className="space-y-6 bg-gray-50 p-4 rounded-xl border-[0.5px] border-gray-200">
        {images.map((img, index) => (
          <div key={index} className="relative bg-white p-4 rounded-xl border-[0.5px] border-gray-300 shadow-sm">
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
              title="Remover este campo"
            >
              <X className="w-4 h-4" />
            </button>
            <ImageUploadField
              label={`Imagem ${index + 1}`}
              value={img}
              onChange={(value) => handleUpdateImage(index, value)}
              placeholder="Adicione um link ou faça upload"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddImage}
          className="w-full py-3 flex justify-center items-center gap-2 border-2 border-dashed border-orange-300 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors text-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          Adicionar campo para imagem
        </button>
      </div>
    </div>
  );
};
