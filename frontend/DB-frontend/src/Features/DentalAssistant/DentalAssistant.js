import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const DentalAssistant = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cse.google.com/cse.js?cx=a2af3c108ae2341ca';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleMicClick = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false });
  };

  useEffect(() => {
    if (transcript && transcript.length > 3) {
      const input = document.querySelector('input.gsc-input');
      if (input) {
        input.value = transcript;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const searchBtn = document.querySelector('.gsc-search-button-v2');
        if (searchBtn) searchBtn.click();
      }
    }
  }, [transcript]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5faff', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', color: '#0077cc' }}>🔍 Dental-Assistant</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>
        Speak or type directly below using Google's search.
      </p>

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <button
          onClick={handleMicClick}
          style={{
            padding: '12px 16px',
            fontSize: '20px',
            borderRadius: '50%',
            backgroundColor: listening ? '#ff5252' : '#0077cc',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
          title="Tap to speak"
        >
          🎤
        </button>
      </div>

      <div className="gcse-search" />
    </div>
  );
};

export default DentalAssistant;
