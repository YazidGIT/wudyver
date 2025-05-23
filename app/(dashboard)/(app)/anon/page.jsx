"use client";

import { useState, useEffect, useRef } from "react";
import SimpleBar from "simplebar-react";
import { useDispatch, useSelector } from "react-redux";
import useWidth from "@/hooks/useWidth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import { setNickname, startChat, sendMessage, skipChat } from "@/components/partials/app/anon/store";

let socket;

const AnonymousChatPage = () => {
  const dispatch = useDispatch();
  const anonymousChat = useSelector((state) => state.anonymousChat || {});
  
  // Destructure with default values
  const {
    nickname = "",
    partner = null,
    messages = [],
    isConnecting = false,
    isConnected = false,
  } = anonymousChat;

  const { width, breakpoints } = useWidth();
  const [message, setMessage] = useState("");
  const [localNickname, setLocalNickname] = useState(""); // Local state for input field
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize the local nickname state with the Redux state
    setLocalNickname(nickname);
  }, [nickname]);

  useEffect(() => {
    // Initialize socket connection when the component mounts
    socketInitializer();

    // Clean up socket connection when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the messages whenever messages array changes
    scrollToBottom();
  }, [messages]);

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to initialize socket.io connection and listeners
  const socketInitializer = async () => {
    // Fetch API route to establish socket connection
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("partnerFound", (data) => {
      toast.success(`Terhubung dengan ${data.partner}!`);
      dispatch({ type: "anonymousChat/partnerFound", payload: data.partner });
    });

    socket.on("noPartner", (data) => {
      toast.warn(data.message);
      dispatch({ type: "anonymousChat/noPartner" });
    });

    socket.on("message", (data) => {
      dispatch({ type: "anonymousChat/receiveMessage", payload: data });
    });

    socket.on("chatSkipped", (data) => {
      toast.info(data.message);
      dispatch({ type: "anonymousChat/chatSkipped" });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  };

  // Handler for nickname input change
  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setLocalNickname(value); // Update local state immediately
    dispatch(setNickname(value)); // Update Redux state
  };

  // Handler for message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Handler to start a new chat
  const handleStartChat = () => {
    // Use localNickname for validation to ensure we're working with the latest value
    if (!localNickname || !localNickname.trim()) {
      toast.warn("Mohon masukkan nama panggilan");
      return;
    }
    
    // Ensure nickname is set in Redux before starting chat
    dispatch(setNickname(localNickname));
    dispatch(startChat());
    
    // Send the local nickname to ensure we're using the latest value
    socket.emit("startChat", { nickname: localNickname });
  };

  // Handler to send a message
  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!message.trim()) return; // Don't send empty messages

    const messageData = {
      message: message,
      from: "me", // Mark message as sent by current user
    };

    dispatch({ type: "anonymousChat/sendMessage", payload: messageData }); // Dispatch to Redux store
    socket.emit("sendMessage", { message: message }); // Emit message to socket server
    setMessage(""); // Clear message input
  };

  // Handler to skip the current chat
  const handleSkipChat = () => {
    dispatch(skipChat());
    socket.emit("skipChat");
  };

  // Debug logging to help diagnose issues
  console.log("Current state:", { localNickname, reduxNickname: nickname, isConnecting, isConnected });

  return (
    <>
      {/* ToastContainer for displaying notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="bg-slate-800 text-slate-200 border border-slate-700"
      />
      <div className="w-full px-2 py-6">
        <Card
          bodyClass="relative p-6 h-full overflow-hidden"
          className="w-full border border-indigo-700 rounded-3xl shadow-lg bg-white text-slate-900"
        >
          <SimpleBar className="h-full">
            {/* Chat header section */}
            <div className="p-6 border-b border-purple-800 bg-gradient-to-r from-slate-800 to-purple-900 rounded-t-3xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-lg">
                  <span className="text-2xl">💬</span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">
                Anonymous Chat
              </h4>
              <p className="text-sm text-center text-slate-400 mt-2">Chat secara anonim dengan orang lain</p>
            </div>

            {/* Conditional rendering based on connection status */}
            {!isConnected ? (
              // Section for entering nickname and starting chat
              <div className="p-6">
                <div className="mb-6 bg-slate-800 p-5 rounded-2xl border border-slate-700">
                  <label className="block text-sm font-medium text-purple-300 mb-3 flex items-center">
                    <span className="mr-2">👤</span>
                    Nama Panggilan
                  </label>
                  <Textinput
                    id="nickname"
                    type="text"
                    placeholder="Masukkan nama panggilan"
                    value={localNickname}
                    onChange={handleNicknameChange}
                    className="bg-slate-900 border-slate-700 text-slate-200 rounded-xl"
                  />
                </div>

                <Button
                  text={
                    isConnecting ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2">⟳</span> Mencari Pasangan...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <span className="mr-2">🔍</span> Mulai Chat
                      </span>
                    )
                  }
                  className="btn-primary w-full py-3 text-sm rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                  onClick={handleStartChat}
                  disabled={isConnecting}
                />
              </div>
            ) : (
              // Section for active chat
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white mr-2">
                      <span className="text-sm">👤</span>
                    </div>
                    <span className="font-medium text-purple-300">Chat dengan: {partner}</span>
                  </div>
                  <Button
                    text={
                      <span className="flex items-center justify-center">
                        <span className="mr-1">⏭️</span> Skip
                      </span>
                    }
                    className="btn-danger py-1 px-3 text-xs rounded-lg bg-red-600 hover:bg-red-700"
                    onClick={handleSkipChat}
                  />
                </div>

                {/* Message display area */}
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-4 h-64 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      Mulai percakapan...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-xl ${
                              msg.from === "me"
                                ? "bg-purple-600 text-white rounded-br-none"
                                : "bg-slate-700 text-slate-200 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} /> {/* Ref for auto-scrolling */}
                    </div>
                  )}
                </div>

                {/* Message input form */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Textinput
                    id="message"
                    type="text"
                    placeholder="Ketik pesan..."
                    value={message}
                    onChange={handleMessageChange}
                    className="flex-1 bg-slate-900 border-slate-700 text-slate-200 rounded-xl"
                  />
                  <Button
                    text={
                      <span className="flex items-center justify-center">
                        <span>📤</span>
                      </span>
                    }
                    className="btn-primary py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                    type="submit"
                  />
                </form>
              </div>
            )}
          </SimpleBar>
        </Card>
      </div>
    </>
  );
};

export default AnonymousChatPage;