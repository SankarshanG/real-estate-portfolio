import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ArrowLeft, Upload, X, Plus, Trash2,
  Bed, Bath, Square, Car, DollarSign
} from 'lucide-react';
import { Property, Image as ImageModel } from '../../types';
import DatabaseService from '../../services/database';
// import { communities } from '../../data/communities';

const PropertyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    price: 0,
    bedrooms: 0,
    sqft: 0,
    address: '',
    city: '',
    state: 'TX',
    zip_code: '',
    lat: 0,
    lng: 0,
    status: 'available',
    build_plan_url: '',
    published: true,
    type: 'single-family',
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ImageModel[]>([]);
  const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing property data if editing
  useEffect(() => {
    const loadProperty = async () => {
      if (isEditing && id) {
        const existingProperty = await DatabaseService.getPropertyById(id);
        if (existingProperty) {
          setFormData(existingProperty);
          // Load existing images for this property
          const images = await DatabaseService.getImagesByProperty(id);
          setExistingImages(images);
        }
      }
    };
    
    loadProperty();
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleDeleteExistingImage = async (imageId: string) => {
    if (!id) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return;
    try {
      const ok = await DatabaseService.deleteImage(imageId);
      if (!ok) {
        alert('Failed to delete image');
        return;
      }
      const refreshed = await DatabaseService.getImagesByProperty(id);
      setExistingImages(refreshed);
    } catch (e) {
      console.error('Delete image failed:', e);
      alert('Delete image failed');
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  // const handleImageCaptionChange = (index: number, value: string) => {
  //   const newCaptions = [...imageCaptions];
  //   newCaptions[index] = value;
  //   setImageCaptions(newCaptions);
  // };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: File[] = [];
      Array.from(files).forEach(file => {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Please use images smaller than 5MB.`);
          return;
        }

        newImages.push(file);
      });
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (PDF, DOC, DOCX, JPG, JPEG)
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg'
      ];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, DOCX, or JPG file for the floor plan.');
        return;
      }
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Floor plan file is too large. Please use files smaller than 10MB.');
        return;
      }

      setFloorPlanFile(file);
    }
  };

  const removeFloorPlan = () => {
    setFloorPlanFile(null);
    setFormData(prev => ({ ...prev, build_plan_url: '' }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), ''],
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.map((feature, i) => i === index ? value : feature) || [],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== FORM SUBMISSION START ===');
    console.log('Form event:', e);
    console.log('Form data state:', formData);
    console.log('Uploaded images count:', uploadedImages.length);
    console.log('Floor plan file:', floorPlanFile);
    
    setIsSubmitting(true);

    try {
      // Test connection first
      console.log('Testing database connection...');
      const connectionTest = await DatabaseService.testConnection();
      console.log('Connection test result:', connectionTest);

      // Prepare property data for database (only basic fields)
      const propertyData: Omit<Property, 'id' | 'update_at'> = {
        title: formData.title || '',
        description: formData.description || '',
        price: formData.price || 0,
        bedrooms: formData.bedrooms || 0,
        sqft: formData.sqft || 0,
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || 'TX',
        zip_code: formData.zip_code || '',
        lat: formData.lat || 0,
        lng: formData.lng || 0,
        status: formData.status || 'available',
        build_plan_url: formData.build_plan_url || '',
        published: formData.published !== false,
        // Images will be handled separately after property creation
      };

      console.log('Submitting property data:', propertyData);
      console.log('Property data type:', typeof propertyData);
      console.log('Property data keys:', Object.keys(propertyData));

      let result;
      if (isEditing) {
        console.log('Editing existing property with ID:', id);
        result = await DatabaseService.updateProperty(id!, propertyData);
        if (!result) {
          throw new Error('Failed to update property');
        }
        alert('Property updated successfully!');
      } else {
        console.log('Creating new property...');
        console.log('Calling DatabaseService.createProperty with:', propertyData);
        result = await DatabaseService.createProperty(propertyData);
        console.log('createProperty result:', result);
        if (!result) {
          throw new Error('Failed to create property');
        }
        alert('Property created successfully!');
        console.log('Property created:', result);
      }

      // Upload floor plan if any
      if (floorPlanFile && result) {
        try {
          console.log('Uploading floor plan:', floorPlanFile.name, 'for property:', result.id);
          const floorPlanUrl = await DatabaseService.uploadFloorPlan(floorPlanFile, result.id);
          if (floorPlanUrl) {
            console.log('Floor plan uploaded successfully:', floorPlanUrl);
          } else {
            console.error('Floor plan upload returned null URL');
          }
        } catch (error) {
          console.error('Error uploading floor plan:', error);
          alert('Property saved but floor plan upload failed. Please try uploading the floor plan again.');
        }
      } else {
        console.log('No floor plan file to upload or no property result');
      }

      // Upload images if any
      if (uploadedImages.length > 0 && result) {
        try {
          console.log('Uploading images for property:', result.id);
          for (let i = 0; i < uploadedImages.length; i++) {
            const image = uploadedImages[i];
            const imageUrl = await DatabaseService.uploadImage(image, result.id, `Property image ${i + 1}`, i);
            if (imageUrl) {
              console.log(`Image ${i + 1} uploaded successfully:`, imageUrl);
            } else {
              console.error(`Image ${i + 1} upload failed`);
            }
          }
        } catch (error) {
          console.error('Error uploading images:', error);
          alert('Property saved but image uploads failed. Please try uploading the images again.');
        }
      } else {
        console.log('No images to upload or no property result');
      }

      // Navigate back to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Error saving property:', error);
      alert(`Error saving property: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-max px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Property' : 'Add New Property'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="TX">Texas</option>
                        <option value="CA">California</option>
                        <option value="FL">Florida</option>
                      </select>
                    </div>
                                         <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         ZIP Code
                       </label>
                       <input
                         type="text"
                         name="zip_code"
                         value={formData.zip_code}
                         onChange={handleInputChange}
                         className="input-field"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Latitude
                       </label>
                       <input
                         type="number"
                         step="any"
                         name="lat"
                         value={formData.lat === 0 ? '' : formData.lat}
                         onChange={handleInputChange}
                         className="input-field"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Longitude
                       </label>
                       <input
                         type="number"
                         step="any"
                         name="lng"
                         value={formData.lng === 0 ? '' : formData.lng}
                         onChange={handleInputChange}
                         className="input-field"
                       />
                     </div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price === 0 ? '' : formData.price}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Square Feet *
                    </label>
                    <div className="relative">
                      <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="sqft"
                        value={formData.sqft === 0 ? '' : formData.sqft}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms === 0 ? '' : formData.bedrooms}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms === 0 ? '' : formData.bathrooms}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garage Spaces
                    </label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="garageSpaces"
                        value={formData.garageSpaces === 0 ? '' : formData.garageSpaces}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      name="type"
                      value={formData.type || 'single-family'}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="single-family">Single Family</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="condo">Condo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status || 'available'}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="under-contract">Under Contract</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isQuickMoveIn"
                      checked={formData.isQuickMoveIn}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Quick Move-In Available</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field"
                  placeholder="Describe the property..."
                />
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Feature</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(formData.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="input-field flex-1"
                        placeholder="Enter feature..."
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload property images</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="btn-primary cursor-pointer"
                  >
                    Choose Images
                  </label>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Property ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {existingImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {existingImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img.image_url}
                            alt={`Existing Property ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingImage(img.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Floor Plan */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Floor Plan</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload floor plan (PDF, DOC, DOCX, JPG)</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg"
                    onChange={handleFloorPlanUpload}
                    className="hidden"
                    id="floorplan-upload"
                  />
                  <label
                    htmlFor="floorplan-upload"
                    className="btn-primary cursor-pointer"
                  >
                    Choose Floor Plan
                  </label>
                </div>

                {(floorPlanFile || formData.build_plan_url) && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Floor Plan</h4>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">FP</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {floorPlanFile ? floorPlanFile.name : 'Floor Plan'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {floorPlanFile ? `${(floorPlanFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF Document'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFloorPlan}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Floor Plan URL (for existing properties) */}
                {!floorPlanFile && formData.build_plan_url && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Floor Plan URL</h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        name="build_plan_url"
                        value={formData.build_plan_url}
                        onChange={handleInputChange}
                        className="input-field flex-1"
                        placeholder="Floor plan URL..."
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, build_plan_url: '' }))}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn-secondary"
            >
              Cancel
            </button>
            
            {/* Test Button */}
            <button
              type="button"
              onClick={async () => {
                console.log('=== TEST BUTTON CLICKED ===');
                try {
                  const testResult = await DatabaseService.addTestProperty();
                  console.log('Test property result:', testResult);
                  alert(`Test property created: ${testResult ? 'SUCCESS' : 'FAILED'}`);
                } catch (error) {
                  console.error('Test button error:', error);
                  alert(`Test error: ${error}`);
                }
              }}
              className="btn-secondary"
            >
              Test DB
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Update Property' : 'Save Property')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm; 