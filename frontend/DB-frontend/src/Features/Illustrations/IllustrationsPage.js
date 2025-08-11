import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const IllustrationsPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const webcamRef = useRef(null);

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (data.secure_url) {
      setMediaList((prev) => [...prev, { type: 'image', src: data.secure_url }]);
    }
  } catch (err) {
    console.error('❌ Image upload failed:', err);
  }
};


 const handleVideoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('video/')) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (data.secure_url) {
      setMediaList((prev) => [...prev, { type: 'video', src: data.secure_url }]);
    }
  } catch (err) {
    console.error('❌ Video upload failed:', err);
  }
};


  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setMediaList((prev) => [...prev, { type: 'image', src: imageSrc }]);
  };

  const startRecording = () => {
    const stream = webcamRef.current.stream;
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks((prev) => [...prev, e.data]);
      }
    };
    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setMediaList((prev) => [...prev, { type: 'video', src: url }]);
      setRecordedChunks([]);
    };
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const handleEmbed = () => {
    const embedSrc = convertToEmbed(videoUrl);
    if (embedSrc) {
      setMediaList((prev) => [...prev, { type: 'embed', src: embedSrc }]);
      setVideoUrl('');
    } else {
      alert('Invalid video URL!');
    }
  };

  const convertToEmbed = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
    }
    if (url.includes('instagram.com')) {
      return url;
    }
    return null;
  };

  const handleDelete = (index) => {
    const updated = [...mediaList];
    updated.splice(index, 1);
    setMediaList(updated);
  };

  const filteredMedia = mediaList.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ color: '#0077b6', fontWeight: 'bold' }}>🖼️ Dental Illustrations</h2>

      <div>
        <label><strong>📤 Upload Image:</strong></label>
        <input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={handleImageUpload} />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label><strong>🎞️ Upload Video:</strong></label>
        <input type="file" accept=".mp4,.webm,.ogg" onChange={handleVideoUpload} />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label><strong> 📸 Take Photo / 🎥 Video:</strong></label><br />
        {!showWebcam ? (
          <button style={btnStyle} onClick={() => setShowWebcam(true)}>🎥 Open Camera</button>
        ) : (
          <>
            <Webcam
              audio={true}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
              videoConstraints={{ facingMode: 'user' }}
            />
            <div style={{ marginTop: '10px' }}>
              <button style={btnStyle} onClick={captureImage}>📷 Capture Photo</button>
              {!recording ? (
                <button style={btnStyle} onClick={startRecording}>🔴 Start Video Recording</button>
              ) : (
                <button style={btnStyle} onClick={stopRecording}>⏹️ Stop Recording</button>
              )}
              <button style={btnStyle} onClick={() => setShowWebcam(false)}>❌ Close Camera</button>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: '10px' }}>
        <label><strong>🌐 Embed YouTube / FB / Insta Video:</strong></label><br />
        <input
          type="text"
          placeholder="Paste video URL here"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{ width: '80%' }}
        />
        <button style={btnStyle} onClick={handleEmbed}>Embed</button>
      </div>

      <div style={{ marginTop: '30px', marginBottom: '10px' }}>
        <button style={tabStyle(activeTab === 'all')} onClick={() => setActiveTab('all')}>📁 All</button>
        <button style={tabStyle(activeTab === 'image')} onClick={() => setActiveTab('image')}>🖼️ Images</button>
        <button style={tabStyle(activeTab === 'video')} onClick={() => setActiveTab('video')}>🎞️ Videos</button>
        <button style={tabStyle(activeTab === 'embed')} onClick={() => setActiveTab('embed')}>🌐 Embedded</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredMedia.map((item, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <button
              onClick={() => handleDelete(index)}
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                backgroundColor: '#fff',
                color: 'black',
                border: '2px solid black',
                borderRadius: '50%',
                fontWeight: 'bold',
                fontSize: '14px',
                width: '28px',
                height: '28px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              ×
            </button>

            {item.type === 'image' && (
              <img src={item.src} alt="dental" width="200" style={{ borderRadius: '10px' }} />
            )}
            {item.type === 'video' && (
              <video src={item.src} width="200" controls style={{ borderRadius: '10px' }} />
            )}
            {item.type === 'embed' && (
              <iframe
                width="200"
                height="113"
                src={item.src}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Embedded video"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const btnStyle = {
  backgroundColor: '#0077b6',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  marginRight: '8px',
  fontWeight: 'bold'
};

const tabStyle = (active) => ({
  backgroundColor: active ? '#0077b6' : '#ccc',
  color: active ? 'white' : '#000',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '6px',
  marginRight: '8px',
  fontWeight: 'bold',
  cursor: 'pointer'
});

export default IllustrationsPage;
