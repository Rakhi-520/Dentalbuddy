import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import './DentalBuddySearch.css'; 

const DentalBuddySearch = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const isAccepted = localStorage.getItem('aiTermsAccepted') === 'true';
    setAcceptedTerms(isAccepted);
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('aiTermsAccepted', 'true');
    setAcceptedTerms(true);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, file };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setFile(null);
    setLoading(true);

    try {
      const apiKey = 'YOUR_GOOGLE_API_KEY'; // 🔁 Replace with your real key
      const cx = 'YOUR_CUSTOM_SEARCH_ENGINE_ID'; // 🔁 Replace with your real CSE ID

      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
          input
        )}&key=${apiKey}&cx=${cx}`
      );
      const data = await response.json();

      const reply =
        data?.items?.length > 0
          ? data.items
              .slice(0, 3)
              .map((item, i) => `${i + 1}. ${item.title}\n${item.snippet}\n${item.link}`)
              .join('\n\n')
          : '⚠️ No relevant medical or dental information found. Try rephrasing.';

      const assistantMessage = { role: 'assistant', content: reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Failed to fetch search results.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Box sx={{ p: 2, maxWidth: '1000px', mx: 'auto', zIndex: 0 }}>
      {!acceptedTerms ? (
        <Dialog open maxWidth="md" fullWidth>
          <DialogTitle fontWeight="bold" color="primary">Terms and Conditions</DialogTitle>
          <DialogContent dividers sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <Typography variant="body1" paragraph>
              DentalBuddy Search is a supportive tool for licensed medical and dental professionals.
            </Typography>
            <Typography variant="body2" paragraph>
              1. Not a certified medical device.
            </Typography>
            <Typography variant="body2" paragraph>
              2. May return inaccurate suggestions. Verify independently.
            </Typography>
            <Typography variant="body2" paragraph>
              3. Do not upload PHI without legal compliance.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAcceptTerms} variant="contained" autoFocus>
              I Accept
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <>
          <Paper elevation={4} sx={{ p: 3, backgroundColor: '#f5fafd', borderRadius: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1976d2' }}>
              DentalBuddy Search
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ maxHeight: '400px', overflowY: 'auto', mb: 2 }}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 1,
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f0f4c3',
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.file && (
                    <Typography variant="body2" color="textSecondary">
                      <InsertDriveFileIcon fontSize="small" /> {msg.file.name}
                    </Typography>
                  )}
                  <Typography variant="body1">{msg.content}</Typography>
                </Box>
              ))}
              {loading && (
                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>

            <Box display="flex" gap={1} alignItems="center">
              <input
                type="text"
                className="ai-input"
                placeholder="Type your dental or medical question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />

              <input
                accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                type="file"
                hidden
                id="upload-button"
                onChange={handleFileChange}
              />
              <label htmlFor="upload-button">
                <IconButton color="primary" component="span">
                  <CloudUploadIcon />
                </IconButton>
              </label>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSend}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Search
              </Button>
            </Box>

            {file && (
              <Typography variant="caption" sx={{ mt: 1, color: 'gray' }}>
                Attached: {file.name}
              </Typography>
            )}
          </Paper>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" color="error" fontWeight="bold" gutterBottom>
              ⚠️ Disclaimer:
            </Typography>
            <Typography variant="body2">
              DentalBuddy Search is a tool for general knowledge and research. It does not provide diagnoses or treatment plans. Use professional judgment.
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DentalBuddySearch;
