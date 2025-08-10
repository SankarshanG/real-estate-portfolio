import React, { useState, useRef } from 'react';
import { 
  Upload, X, Search, Grid, List, 
  Trash2, Download, Eye, Image
} from 'lucide-react';

interface ImageItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
  category: 'property' | 'community' | 'amenity';
  tags: string[];
}

const ImageManager: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const newImages: ImageItem[] = [];

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageItem: ImageItem = {
            id: Date.now().toString() + index,
            name: file.name,
            url: e.target.result as string,
            size: file.size,
            type: file.type,
            uploadedAt: new Date(),
            category: 'property',
            tags: [],
          };
          newImages.push(imageItem);
          
          if (newImages.length === files.length) {
            setImages(prev => [...prev, ...newImages]);
            setIsUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (imageId: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImages(prev => prev.filter(img => img.id !== imageId));
      setSelectedImages(prev => prev.filter(id => id !== imageId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedImages.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) {
      setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
      setSelectedImages([]);
    }
  };

  const handleImageSelect = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img.id));
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || image.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-max px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Image Management</h1>
              <p className="text-sm text-gray-600">Upload and organize property images</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
                disabled={isUploading}
              >
                <Upload className="w-5 h-5" />
                <span>{isUploading ? 'Uploading...' : 'Upload Images'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8">
        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Categories</option>
                <option value="property">Property Images</option>
                <option value="community">Community Images</option>
                <option value="amenity">Amenity Images</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {selectedImages.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
              <span className="text-sm text-primary-700">
                {selectedImages.length} image(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Selected</span>
                </button>
                <button
                  onClick={() => setSelectedImages([])}
                  className="text-gray-600 hover:text-gray-700"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Images Grid/List */}
        {filteredImages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Upload your first image to get started'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary mx-auto"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Images</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-6">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedImages.includes(image.id) 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => handleImageSelect(image.id)}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.id);
                          }}
                          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">{image.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredImages.map((image) => (
                      <tr key={image.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedImages.includes(image.id)}
                            onChange={() => handleImageSelect(image.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="h-12 w-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{image.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatFileSize(image.size)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {image.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {image.uploadedAt.toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-primary-600 hover:text-primary-900" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteImage(image.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {filteredImages.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {filteredImages.length} image(s) • {formatFileSize(filteredImages.reduce((sum, img) => sum + img.size, 0))} total
              </div>
              <div className="text-sm text-gray-700">
                {selectedImages.length} selected
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManager; 