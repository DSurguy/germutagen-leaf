const KEY_CODES = {}

class KeyManager{
  constructor(){
    this.upHandlers = [];
    this.downHandlers = []
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
      for( let handler of this.downHandlers ){
        handler(event);
      }
    }
    else{
      for( let handler of this.upHandlers ){
        handler(event);
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