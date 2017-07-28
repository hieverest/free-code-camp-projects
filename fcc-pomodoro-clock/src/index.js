import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';



class App extends React.Component {
  constructor() {
    super()
    this.state = {
      minutes: 25,
      seconds: 0,
      shortBreak: 5,
      longBreak: 15,
      focus: 25,
      aimTomatoes: 4,
      tomatoes: 0,
      mode: 'focus',
      status: 'stop',
      panel: 'time',
    }
    this.pTimer = null;
  }

  startTimer = (minutes, seconds) => {
    let { mode, tomatoes, aimTomatoes, shortBreak, longBreak } = this.state
    if (this.pTimer === null) {
      this.setState({
        status: 'running'
      })
      let timer = minutes * 60 + seconds
      this.pTimer = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        this.setState(preState => ({
          minutes,
          seconds
        }))
        if (--timer < 0) {
          clearInterval(this.pTimer)
          this.pTimer = null;
          if(mode ==='focus') {
            tomatoes++;
            if(tomatoes < aimTomatoes) {
              mode = 'shortBreak';           
            } else {
              mode = 'longBreak';
            }
          } else if(mode ==='shortBreak') {
            mode = 'focus'
          } else if(mode ==='longBreak') {
            mode = 'focus'
            tomatoes = 0
          }

          this.setState({
            mode,
            minutes: this.state[mode],
            tomatoes,
            status: 'stop'
          })
        }
      }, 1000);
    }


  }

  handleClick = (op) => {
    let { minutes, seconds, breakTime, shortBreak, longBreak, focus, tomatoes, mode} = this.state;
    switch (mode) {
      case 'focus':
        minutes = focus;
        break;
      case 'shortBreak':
        minutes = shortBreak;
        break
      case 'longBreak':
        minutes = longBreak;
        break
      default:
        break
    }
    if (op === 'start') {
      this.startTimer(minutes, seconds)
    } else if( op === 'interrupt'){
      clearInterval(this.pTimer)
      this.pTimer = null
      this.setState({
        minutes: this.state[mode],
        seconds: 0,
        status: 'stop'
      })
    } else if( op==='settings') {
      this.setState({
        panel: 'settings'
      })
    } else if( op === 'backToTime') {
      this.setState({
        minutes: this.state[mode],
        panel: 'time'
      })
    }

  }


  handleChange = e => {
    const target = e.target
    const value = target.value
    const name = target.id
    
    this.setState({
      [name]: value,
    })
  }



  render() {
    let { minutes, seconds, shortBreak, longBreak, focus,tomatoes, aimTomatoes, status, mode, panel } = this.state

    let state = JSON.stringify(this.state, null, 4)
    let button = status === 'running' ? 'interrupt' : 'start'
    let buttonType = button === 'start'? 'btn-primary' : 'btn-danger'
    let modeType
    if(mode ==='focus') {
      modeType = 'Focus'
    } else if (mode ==='shortBreak') {
      modeType = 'Short Break'
    } else if (mode ==='longBreak') {
      modeType = 'Long Break'
    }
    
    let greyTomato = [], colorTomato = []
    for(let i=0; i<(aimTomatoes - tomatoes); i++) {
      greyTomato.push(<i className="iconfont icon-tomato" />)
    }
    for(let i=0; i<tomatoes; i++) {
      colorTomato.push(<svg className="svg-icon-tomato" aria-hidden="true" dangerouslySetInnerHTML={{__html: '<use xlink:href="#icon-tomato" />' }} />)
    }
    
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if(panel === 'time') {
      return (
        <div>
          <div className="panel-time" >
            
            {colorTomato}
            {greyTomato}
            
            <div className='mode-type' >{modeType}</div>
            <div className='time-diplay'>
              
              {`${minutes}:${seconds}`}
              
            </div>
            
            <button className={`btn ${buttonType}`} onClick={() => this.handleClick(button)} >{button}</button>
            <button className={`btn btn-primary `} onClick={() => this.handleClick('settings')} >options</button>
            <br />
            
          </div>
          
        </div>
        
        
      )
    } else if(panel ==='settings') {
      return (
        <div className='panel-settings form-group' >
          <div className="settings-short-break form-group row">
            <label htmlFor="short-break" className="col-2 offset-3 col-form-label" >Short Break</label>
            <div className="col-3">
              <input type="number" className="form-control" id="shortBreak"  defaultValue={shortBreak} onChange={(e)=> this.handleChange(e)} />
            </div>
          </div>
          <div className="settings-long-break form-group row">
            <label htmlFor="long-break" className="col-2 offset-3 col-form-label" >Long Break</label>
            <div className="col-3">
              <input type="number" className="form-control" id="longBreak" defaultValue={longBreak} onChange={(e)=> this.handleChange(e)}/>
            </div>
          </div>
          <div className="settings-focus-time form-group row">
            <label htmlFor="focus-time" className="col-2 offset-3 col-form-label" >Focus Time</label>
            <div className="col-3">
              <input type="number" className="form-control" id="focus" defaultValue={focus} onChange={(e)=> this.handleChange(e)}/>
            </div>
          </div>
          <div className="settings-tomatoes form-group row">
            <label htmlFor="tomatoes" className="col-2 offset-3 col-form-label" >Tomatoes</label>
            <div className="col-3">
              <input type="number" className="form-control" id="aimTomatoes" defaultValue={aimTomatoes} onChange={(e)=> this.handleChange(e)} />
            </div>
          </div>
          <button className='btn btn-primary' onClick={() => this.handleClick('backToTime')}>Apply</button>
          <br />
        
        </div>
        

      )
    }

    
  }
}


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
