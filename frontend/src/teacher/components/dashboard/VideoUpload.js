import React, { useState } from 'react';
import '../../styles/dashboard/videoUpload.css';

function VideoUpload({ onClose, onUploadComplete }) {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoDetails, setVideoDetails] = useState({
    title: '',
    description: '',
    thumbnail: null,
    visibility: 'public'
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setVideoDetails(prev => ({
        ...prev,
        thumbnail: file
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) return;

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        onUploadComplete?.({
          ...videoDetails,
          videoFile,
          uploadedAt: new Date().toISOString()
        });
        onClose?.();
      }
    }, 500);

    // In a real application, you would use FormData and make an API call
    // const formData = new FormData();
    // formData.append('video', videoFile);
    // formData.append('title', videoDetails.title);
    // formData.append('description', videoDetails.description);
    // formData.append('thumbnail', videoDetails.thumbnail);
    // formData.append('visibility', videoDetails.visibility);
    // await uploadToServer(formData);
  };

  return (
    <div className="video-upload-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Upload Video</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleUpload} className="upload-form">
          {!videoFile ? (
            <div className="upload-area">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="file-input"
                id="video-input"
              />
              <label htmlFor="video-input" className="upload-label">
                <i className="fas fa-cloud-upload-alt"></i>
                <span>Drag and drop or click to upload video</span>
                <span className="file-types">MP4, WebM, MOV (max 2GB)</span>
              </label>
            </div>
          ) : (
            <div className="video-preview-container">
              <video 
                src={videoPreview} 
                controls 
                className="video-preview"
              />
              <button 
                type="button" 
                className="change-video"
                onClick={() => {
                  setVideoFile(null);
                  setVideoPreview(null);
                }}
              >
                Change Video
              </button>
            </div>
          )}

          {videoFile && (
            <>
              <div className="form-group">
                <label>Video Title*</label>
                <input
                  type="text"
                  name="title"
                  value={videoDetails.title}
                  onChange={handleInputChange}
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={videoDetails.description}
                  onChange={handleInputChange}
                  placeholder="Enter video description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                  className="file-input"
                />
              </div>

              <div className="form-group">
                <label>Visibility</label>
                <select
                  name="visibility"
                  value={videoDetails.visibility}
                  onChange={handleInputChange}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </div>

              {uploadProgress > 0 && (
                <div className="upload-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  />
                  <span>{uploadProgress}% Uploaded</span>
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={onClose} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="upload-btn">
                  Upload Video
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default VideoUpload; 