// components/ClearChatButton.jsx
import { BACKEND_URL } from "../utils/constants";

export default function ClearChatButton({ activePersona, setChats }) {
  const handleClearChat = async () => {
    try {
      await fetch(`${BACKEND_URL}/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: activePersona })
      });

      // Clear frontend messages for this persona
      setChats(prev => ({ ...prev, [activePersona]: [] }));
    } catch (err) {
      console.error("Failed to clear chat:", err);
    }
  };

  return (
    <button
      onClick={handleClearChat}
      className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition"
    >
      Clear Chat
    </button>
  );
}