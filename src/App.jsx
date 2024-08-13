import { useState, useEffect } from 'react'
import './App.css'
import { io } from "socket.io-client";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [userInput, setUserInput] = useState('');
  
  function connectToChatServer() {
    console.log(connectToChatServer);
    const _socket = io('http://localhost:3000', {
      autoConnect: false,
      query: {
        username
      }
    });
    _socket.connect();
    setSocket(_socket);
  }

  function disConnectToChatServer() {
    console.log(disConnectToChatServer);
    socket?.disconnect();
  }

  function onConnected() {
    console.log('프론트 - onConnected');
    setIsConnected(true);
  }

  function onDisconnected() {
    console.log('프론트 - onDisconnected');
    setIsConnected(false);
  }

  function onMessageRecieved(msg) {
    console.log(msg);

    setMessages(prev => [...prev, msg]);
  }

  function sendMessageToChatServer() {
    console.log(`메시지를 보냈어요. ${userInput}`);
    socket?.emit("new message", {username, message: userInput}, (response) => {
      console.log(response);
    })
  }

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth",
    })
  }, [messages])

  useEffect(() => {
    console.log('useEffect called');
    socket?.on('connect', onConnected);
    socket?.on('disconnect', onDisconnected);

    socket?.on('new message', onMessageRecieved);

    return () => {
      console.log('useEffect clean up function called');
      socket?.off('connect', onConnected);
      socket?.off('disconnect', onDisconnected);
      socket?.off('new message', onMessageRecieved);
    }
  }, [socket])

  const messageList = messages.map((aMsg, index) =>
    <li key={index}>
      {aMsg.username} : {aMsg.message}
    </li>
  );

  return (
    <>
      <div className='navbar'>
        <h1>유저: {username}</h1>
        <h2>현재 접속상태: {isConnected ? "접속중" : "미접속"}</h2>

        <div className="card">
          <input value={username} onChange={e => setUsername(e.target.value)} />
          <button onClick={() => connectToChatServer()}>
            접속
          </button>
          <button onClick={() => disConnectToChatServer()}>
            접속종료
          </button>
        </div>
      </div>

      <ul className='chatList'>
        {messageList}
      </ul>

      <form className='MessageInput' onSubmit={event => sendMessageToChatServer(event)}>
        <input value={userInput} onChange={e => setUserInput(e.target.value)} />
        <button type='submit'>
          보내기
        </button>
      </form>

    </>
  )
}

export default App
