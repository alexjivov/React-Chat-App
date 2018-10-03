import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit';

/* COMPONENTS */
import MessageList from '../components/MessageList';
import SendMessageForm from '../components/SendMessageForm';
import RoomList from '../components/RoomList';
import NewRoomForm from '../components/NewRoomForm';

import { tokenUrl, instanceLocator} from '../config';

import './App.css';



class App extends Component {
  constructor() {
    super()
    this.state = {
      currentRoomID: null,
      joinableRooms: [],
      joinedRooms: [],
      messages: []
    }
    this.subscribeToRoom = this.subscribeToRoom.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.subscribeToRoom = this.subscribeToRoom.bind(this)
  }

  componentDidMount () {
    const chatManager = new Chatkit.ChatManager ({
      instanceLocator: instanceLocator,
      userId: "ajivov",
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenUrl
      })
    })

    chatManager.connect()
    .then(currenUser => {
      this.currentUser = this.currentUser
      return this.currentUser.getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        })
      })
    })
    .catch(err => console.log('error connecting', err))
  }

  sendMessage(text) {
    this.currentUser.sendMessage({
      text,
      roomId: this.state.currentRoomID
    })
  }

  createRoom(name) {
    this.currentUser.createRoom({
      name
    })
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log(err))
  }

  subscribeToRoom(roomId) {
    this.setState({
      message: []
    });
    this.currentUser.subscribeToRoom({
      roomId: roomId,
      hooks: {
        onNewMessage: message => {
          this.setState({
            messages: [...this.state.messages, message]
          })
        }
      }
    })
    .then(currentRoom => {
      this.setState({currentRoomId: currentRoom.id})
      return this.currentUser.getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        })
      })
    })
    .catch(err => console.log('error on subscribing', err))
  }

  
  render() {
    return (
      <div className="App">
       
      </div>
    );
  }
}

export default App;
