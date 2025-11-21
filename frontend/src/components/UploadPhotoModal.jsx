import React, { useState, useRef } from 'react';

const UploadPhotoModal = ({ isOpen, onClose, onSave, currentPhoto }) => {
  const [photoPreview, setPhotoPreview] = useState(currentPhoto || null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
  const [stream, setStream] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB máximo
        alert('La imagen no debe superar 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setPhotoPreview(dataUrl);
      stopCamera();
    }
  };

  const handleSave = () => {
    if (photoPreview) {
      onSave(photoPreview);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setPhotoPreview(currentPhoto || null);
    setActiveTab('upload');
    onClose();
  };

  const handleTabChange = (tab) => {
    if (tab === 'camera' && !stream) {
      startCamera();
    } else if (tab === 'upload' && stream) {
      stopCamera();
    }
    setActiveTab(tab);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Foto de Perfil
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => handleTabChange('upload')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Subir Imagen</span>
              </div>
            </button>
            <button
              onClick={() => handleTabChange('camera')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'camera'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Tomar Foto</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {photoPreview ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={photoPreview}
                      alt="Vista previa"
                      className="max-w-full h-auto rounded-lg shadow-lg max-h-96 object-contain"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                  >
                    Seleccionar otra imagen
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-4 text-sm text-gray-600">
                    Haz clic para seleccionar una imagen
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, JPEG hasta 5MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="space-y-4">
              {!photoPreview ? (
                <>
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={capturePhoto}
                      className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Capturar Foto</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={photoPreview}
                      alt="Foto capturada"
                      className="max-w-full h-auto rounded-lg shadow-lg max-h-96 object-contain"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setPhotoPreview(null);
                      startCamera();
                    }}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                  >
                    Tomar otra foto
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!photoPreview}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Foto
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
