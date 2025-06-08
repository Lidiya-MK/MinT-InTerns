import { useState, useEffect, useRef } from "react";
import { FiSend, FiImage, FiSmile, FiCornerUpRight } from "react-icons/fi";

const dummyUsers = [
  // Interns
  {
    id: 1,
    name: "Lidiya Mamo",
    role: "Intern",
    profile: "https://randomuser.me/api/portraits/women/1.jpg",
    lastMessage: "Can you review my PR?",
  },
  {
    id: 2,
    name: "Abdi Geremew",
    role: "Intern",
    profile: "https://randomuser.me/api/portraits/men/2.jpg",
    lastMessage: "Let's meet at 3PM.",
  },
  // Supervisors
  {
    id: 3,
    name: "Helen Tadesse",
    role: "Supervisor",
    profile: "https://randomuser.me/api/portraits/women/3.jpg",
    lastMessage: "Update me on the progress.",
  },
  // Administrators
  {
    id: 4,
    name: "John Doe",
    role: "Administrator",
    profile: "https://randomuser.me/api/portraits/men/4.jpg",
    lastMessage: "Meeting is postponed.",
  },
];

const dummyMessages = [
  { id: 1, sender: "other", text: "Hey, are you available for a quick sync?" },
  { id: 2, sender: "me", text: "Yes! Give me 2 mins." },
  { id: 3, sender: "other", text: "Perfect, thanks." },
];

export default function CompanyChats() {
  const [selectedContact, setSelectedContact] = useState(dummyUsers[0]);
  const [messages, setMessages] = useState(dummyMessages);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const [forwardingMsg, setForwardingMsg] = useState(null);

  const sendSound = useRef(null);
  const receiveSound = useRef(null);
  const prevMessagesLength = useRef(messages.length);
  const fileInputRef = useRef(null);
  const messageContainerRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = function (event) {
          setImage(event.target.result);
        };
        reader.readAsDataURL(file);
        e.preventDefault();
        break;
      }
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() && !image) return;

    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: newMessage.trim(),
      image: image || null,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
    setImage(null);
    sendSound.current?.play();
  };

  const forwardMessage = (msg, contactId) => {
    if (contactId === selectedContact.id) return;
    alert(`Message forwarded to ${dummyUsers.find((u) => u.id === contactId)?.name}`);
  };

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      const latestMsg = messages[messages.length - 1];
      if (latestMsg.sender === "other") {
        receiveSound.current?.play();
      }
      prevMessagesLength.current = messages.length;
    }
  }, [messages]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const groupedContacts = {
    Interns: dummyUsers.filter((u) => u.role === "Intern"),
    Supervisors: dummyUsers.filter((u) => u.role === "Supervisor"),
    Administrators: dummyUsers.filter((u) => u.role === "Administrator"),
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white" onPaste={handlePaste}>
      <audio ref={sendSound} src="/assets/sent.mp3" preload="auto" />
      <audio ref={receiveSound} src="/assets/received.mp3" preload="auto" />

      <div className="w-72 bg-[#1b1b1b] p-4 border-r border-gray-700 overflow-y-auto">
        <h2 className="text-xl font-bold text-[#EA9753] mb-4">MinT Chat</h2>
        {Object.entries(groupedContacts).map(([role, users]) => (
          <div key={role} className="mb-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">{role}</h3>
            {users.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#2a2a2a] ${
                  selectedContact.id === contact.id ? "bg-[#2a2a2a]" : ""
                }`}
              >
                <img src={contact.profile} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-gray-400 truncate w-40">{contact.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-center gap-3 p-4 border-b border-gray-700 bg-[#1b1b1b]">
          <img src={selectedContact.profile} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h3 className="font-bold text-lg">{selectedContact.name}</h3>
            <p className="text-sm text-gray-400">Online</p>
          </div>
        </div>

        <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`group max-w-xs px-4 py-2 rounded-lg relative ${
                msg.sender === "me"
                  ? "bg-[#144145] self-end text-white ml-auto"
                  : "bg-gray-700 text-white"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="sent image"
                  className="rounded-lg mb-2 max-w-[200px] max-h-[200px]"
                />
              )}
              {msg.text && <p>{msg.text}</p>}
              <button
                onClick={() => setForwardingMsg(msg)}
                className="absolute top-1 right-1 hidden group-hover:block text-gray-400 hover:text-white"
              >
                <FiCornerUpRight />
              </button>
            </div>
          ))}
        </div>

        {forwardingMsg && (
          <div className="p-4 border-t border-b border-gray-700 bg-[#2a2a2a]">
            <p className="mb-2 text-sm text-gray-300">Forward to:</p>
            <div className="flex flex-wrap gap-2">
              {dummyUsers.map((user) => (
                <button
                  key={user.id}
                  className="bg-[#EA9753] text-black px-2 py-1 rounded hover:bg-[#d86e2c]"
                  onClick={() => {
                    forwardMessage(forwardingMsg, user.id);
                    setForwardingMsg(null);
                  }}
                >
                  {user.name}
                </button>
              ))}
              <button
                onClick={() => setForwardingMsg(null)}
                className="ml-auto text-sm text-red-400 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-700 bg-[#1b1b1b]">
          {image && (
            <div className="mb-2 flex items-center gap-2">
              <img src={image} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
              <button onClick={() => setImage(null)} className="text-sm text-red-400 hover:underline">
                Remove
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
              id="imageUpload"
            />
            <label htmlFor="imageUpload" className="cursor-pointer text-[#EA9753] hover:text-[#d86e2c]">
              <FiImage size={24} />
            </label>
            <button className="text-[#EA9753] hover:text-[#d86e2c]">
              <FiSmile size={24} />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-[#2a2a2a] text-white p-2 rounded-lg outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="text-[#EA9753] hover:text-[#d86e2c]">
              <FiSend size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
