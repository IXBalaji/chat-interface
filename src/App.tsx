import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Plus, Paperclip, Search, MoreVertical, Phone, Video, X } from 'lucide-react';
import EmojiPicker from './components/EmojiPicker';
import FileUpload from './components/FileUpload';
import CallModal from './components/CallModal';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  type?: 'text' | 'file' | 'image';
  fileName?: string;
  fileSize?: string;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: Date;
  avatar: string;
  unread?: number;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! How's your day going?",
      sender: 'other',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      text: "Pretty good! Working on some new designs. The project is coming along nicely and I'm excited to share the progress with you.",
      sender: 'user',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      text: "That sounds exciting! Can't wait to see them. I've been working on something similar myself.",
      sender: 'other',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: 4,
      text: "Really? We should collaborate sometime! 🚀",
      sender: 'user',
      timestamp: new Date(Date.now() - 120000)
    }
  ]);
  
  const [allChats] = useState<Chat[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: "That sounds exciting! Can't wait to see them",
      timestamp: new Date(Date.now() - 180000),
      avatar: 'SJ',
      unread: 2
    },
    {
      id: 2,
      name: 'Mike Chen',
      lastMessage: 'Thanks for the help earlier!',
      timestamp: new Date(Date.now() - 3600000),
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Design Team',
      lastMessage: 'Meeting at 3 PM tomorrow',
      timestamp: new Date(Date.now() - 7200000),
      avatar: 'DT',
      unread: 5
    },
    {
      id: 4,
      name: 'Alex Rivera',
      lastMessage: 'Perfect! See you then',
      timestamp: new Date(Date.now() - 86400000),
      avatar: 'AR'
    },
    {
      id: 5,
      name: 'Emma Wilson',
      lastMessage: 'The files look great',
      timestamp: new Date(Date.now() - 172800000),
      avatar: 'EW'
    },
    {
      id: 6,
      name: 'John Smith',
      lastMessage: 'Let me know when you are free',
      timestamp: new Date(Date.now() - 259200000),
      avatar: 'JS'
    },
    {
      id: 7,
      name: 'Lisa Brown',
      lastMessage: 'Great work on the presentation!',
      timestamp: new Date(Date.now() - 345600000),
      avatar: 'LB'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [activeChat, setActiveChat] = useState(allChats[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(allChats);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showCallModal, setShowCallModal] = useState<'voice' | 'video' | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChats(allChats);
    } else {
      const filtered = allChats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery, allChats]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputText.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Simulate a response
      setTimeout(() => {
        const responses = [
          "That's awesome! 👍",
          "Nice work! 🎉",
          "Looking forward to it! 😊",
          "Great job! 💪",
          "Sounds good! ✨",
          "I agree completely! 👌",
          "Let me know if you need any help 🤝"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage: Message = {
          id: Date.now() + 1,
          text: randomResponse,
          sender: 'other',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 1000 + Math.random() * 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const handleFileSelect = (file: File) => {
    const newMessage: Message = {
      id: Date.now(),
      text: `📎 ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'file',
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate response
    setTimeout(() => {
      const responseMessage: Message = {
        id: Date.now() + 1,
        text: "File received! Thanks for sharing 📁",
        sender: 'other',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  const handlePlusClick = () => {
    // Quick actions menu
    const actions = ['Share Contact', 'Send Location', 'Create Poll', 'Schedule Message'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    const newMessage: Message = {
      id: Date.now(),
      text: `✨ ${randomAction} feature coming soon!`,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleCall = (type: 'voice' | 'video') => {
    setShowCallModal(type);
    setShowMoreMenu(false);
  };

  const handleEndCall = () => {
    setShowCallModal(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatChatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return formatTime(date);
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowEmojiPicker(false);
      setShowFileUpload(false);
      setShowMoreMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="h-screen bg-white flex">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No conversations found</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                  activeChat.id === chat.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{formatChatTime(chat.timestamp)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      {chat.unread && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {activeChat.avatar}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{activeChat.name}</h2>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleCall('voice')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Phone size={20} />
              </button>
              <button 
                onClick={() => handleCall('video')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Video size={20} />
              </button>
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMoreMenu(!showMoreMenu);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-10">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      View Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Mute Notifications
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Clear Chat
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                      Block User
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                    {message.type === 'file' && message.fileName && (
                      <div className="mt-2 text-xs opacity-75">
                        {message.fileSize}
                      </div>
                    )}
                  </div>
                  <div className={`mt-1 text-xs text-gray-400 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Text Box Style */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto relative">
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:border-blue-500 focus-within:shadow-lg">
              <div className="flex items-center px-4 py-3">
                {/* Left side buttons */}
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFileUpload(!showFileUpload);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors mr-2"
                  >
                    <Paperclip size={18} />
                  </button>
                  {showFileUpload && (
                    <FileUpload 
                      onFileSelect={handleFileSelect}
                      onClose={() => setShowFileUpload(false)}
                    />
                  )}
                </div>
                
                <button 
                  onClick={handlePlusClick}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors mr-3"
                >
                  <Plus size={18} />
                </button>
                
                {/* Main input field */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message"
                    className="w-full bg-transparent border-0 focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                {/* Right side buttons */}
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowFileUpload(false);
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors ml-2"
                  >
                    <Smile size={18} />
                  </button>
                  {showEmojiPicker && (
                    <EmojiPicker 
                      onEmojiSelect={handleEmojiSelect}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  )}
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className={`p-1.5 rounded-full transition-all duration-200 ml-3 ${
                    inputText.trim()
                      ? 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Modal */}
      {showCallModal && (
        <CallModal
          type={showCallModal}
          contactName={activeChat.name}
          contactAvatar={activeChat.avatar}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  );
}

export default App;