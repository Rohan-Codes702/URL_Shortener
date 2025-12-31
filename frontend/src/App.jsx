import { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url || loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });

      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);

      const qr = await QRCodeGenerator.toDataURL(newShortUrl);
      setQrImage(qr);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-800">

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-500">
            URL Shortener
          </h1>
          <p className="text-gray-400">
            Shorten your links & generate QR codes instantly
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleShorten}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Shortening..." : "Generate Short URL"}
          </button>
        </div>

        {/* Result */}
        {shortUrl && (
          <div className="space-y-5 pt-4 border-t border-gray-800">

            {/* Short URL */}
            <div className="text-center space-y-2">
              <p className="text-gray-400">Your short link</p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 break-all font-medium"
              >
                {shortUrl}
              </a>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`w-full py-2 rounded-lg font-semibold transition ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-200"
              }`}
            >
              {copied ? "Copied ✓" : "Copy to Clipboard"}
            </button>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-3 bg-white p-4 rounded-xl">
              <p className="font-semibold text-gray-800">QR Code</p>
              <QRCode value={shortUrl} size={180} />
            </div>

            {/* Download */}
            {qrImage && (
              <a
                href={qrImage}
                download="qr-code.png"
                className="w-full text-center py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition text-white font-semibold"
              >
                Download QR Code
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
