const KEY_CODES = {}

class KeyManager{
  constructor(){
    this.upHandlers = [];
    this.downHandlers = [];
    this.state = {
      isDown: false,
      downStartTime: 0,
      lastDownDuration: 0
    }
  }
  
  on(eventType, handler){
    if( eventType === 'keydown' && this.downHandlers.includes(handler) === false ){
      this.downHandlers.push(handler)
    }
    else if (this.upHandlers.includes(handler) === false ){
      this.upHandlers.push(handler)
    }
  }

  off(eventType, handler){
    if( eventType === 'keydown' ){
      const indexOfHandler = this.downHandlers.indexOf(handler)
      if( indexOfHandler !== -1 ){
        this.downHandlers.splice(indexOfHandler, 1)
      }
    }
    else{
      const indexOfHandler = this.upHandlers.indexOf(handler)
      if( indexOfHandler !== -1 ){
        this.upHandlers.splice(indexOfHandler, 1)
      }
    }
  }

  trigger(event){
    if( event.type === 'keydown' ){
      this.state.isDown = true;
      this.state.downStartTime = Date.now();
      for( let handler of this.downHandlers ){
        handler(event, this.state);
      }
    }
    else{
      this.state.isDown = false;
      this.state.lastDownDuration = Date.now() - this.state.downStartTime;
      this.state.downStartTime = 0;
      for( let handler of this.upHandlers ){
        handler(event, this.state);
      }
    }
  }
}

export default class Keyboard {
  constructor(){
    this.keyManagers = {};
    document.addEventListener("keydown", this._handleKeyEvent.bind(this))
    document.addEventListener("keyup", this._handleKeyEvent.bind(this))
  }

  _handleKeyEvent(e){
    if( this.keyManagers.hasOwnProperty(e.key) ){
      this.keyManagers[e.key].trigger(e);
    }
  }

  getKey(key) {
    if( !this.keyManagers[key] ){
      const newManager = new KeyManager(key);
      this.keyManagers[key] = newManager;
    }
    return this.keyManagers[key];
  }
}

export const sharedKeyboard = new Keyboard();