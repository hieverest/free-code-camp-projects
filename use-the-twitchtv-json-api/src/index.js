import React from 'react';
import ReactDOM from 'react-dom';
import fetchJsonp from 'fetch-jsonp';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const Channel = ({
  chName,
  chGame,
  chImage,
  chLink,
  chStatus
}) => {

  if (chStatus) {
    return (

      <div className="channel">
        <div className="logo" >
          <img src={chImage} alt="logo" />
        </div>

        <div className="info">
          <a href={chLink} target="_blank" >
            <div className="name-row">Channel: {chName}</div>
          </a>
          <br />
          <div className="game-row">Now: {chGame}</div>
        </div>

      </div>
    )
  }
  else {
    return (
      <div className="channel-loading">
        <i className="fa fa-spinner" aria-hidden="true"></i>

      </div>
    )
  }

}

class Channels extends React.Component {
  constructor() {
    super();
    this.state = {
      channels: [{
        name: "ESL_SC2",
        status: ""
      }, {
        name: "OgamingSC2",
        status: ""
      }, {
        name: "cretetion",
        status: ""
      }, {
        name: "freecodecamp",
        status: ""
      }, {
        name: "storbeck",
        status: ""
      }, {
        name: "habathcx",
        status: ""
      }, {
        name: "RobotCaleb",
        status: ""
      }, {
        name: "noobs2ninjas",
        status: ""
      }],
      timeOut: false,
    }
  }

  componentWillMount() {

    let channels = this.state.channels.slice();
    console.log(channels)
    let type = this.state.type;
    channels.forEach((channel, index) => {
      fetchJsonp(`https://wind-bow.gomix.me/twitch-api/streams/${channel.name}`, {
        timeout: 10000,
      })
        .then((res) => {
          return res.json()
        })
        .then(res => {
          //console.log(res)
          if (res.stream === null) {
            channel.status = "Offline"
          } else if (res.stream === undefined) {
            channel.status = "Account closed"
          } else {
            channel.status = "Online"
            channel.game = res.stream.game
          }
          this.setState({
            channels
          })
        })
        .catch(err => {
          console.log(err.message)
          this.setState({
            timeOut: true
          })
        })


      fetchJsonp(`https://wind-bow.gomix.me/twitch-api/channels/${channel.name}`, {
        timeout: 10000,
      }).then(res => res.json()).then(res => {
        channel.logo = res.logo !== null ? res.logo : "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F";
        channel.name = res.display_name != null ? res.display_name : channel.name;
        channel.game = channel.status === "Online" ? res.game + " - " + res.status : channel.status;
        channel.url = res.url;
        this.setState({
          channels
        })
      })
    })


  }


  render() {

    console.log(this.state.channels);
    let switchStatus = this.props.switchStatus.slice();
    if (this.state.timeOut) {
      return (
        <div className="timeout">
          Oops, time out! Please refresh.
        </div>
      )
    } else {
      if (switchStatus[0]) {
        return (
          <div className="channels">
            {this.state.channels.map((channel, index) => {
              if (channel.status === "Online") {
                return <Channel key={index} chLink={channel.url} chStatus={channel.status} chImage={channel.logo} chName={channel.name} chGame={channel.game} />
              }
              else {
                return <Channel key={index} chLink={channel.url} chStatus={channel.status} chImage={channel.logo} chName={channel.name} chGame={channel.status} />
              }
            })
            }
          </div>
        )
      } else if (switchStatus[1]) {
        return (
          <div className="channels">
            {this.state.channels.map((channel, index) => {
              if (channel.status === "Online") {
                return <Channel key={index} chLink={channel.url} chStatus={channel.status} chImage={channel.logo} chName={channel.name} chGame={channel.game} />
              }
            })
            }

          </div>
        )
      } else if (switchStatus[2]) {
        return (
          <div className="channels">
            {this.state.channels.map((channel, index) => {
              if (channel.status === "Offline") {
                return <Channel key={index} chLink={channel.url} chStatus={channel.status} chImage={channel.logo} chName={channel.name} chGame={channel.status} />
              }
            })
            }

          </div>
        )

      }
    }

  }
}

const Switch = ({
  func,
  handleClick
}) => {
  return (
    <button className="btn btn-default" onClick={handleClick} >{func}</button>
  )
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isAll: 1,
      isOnline: 0,
      isOffline: 0,
    };
    this.showOnline = this.showOnline.bind(this);
    this.showAll = this.showAll.bind(this);
    this.showOffline = this.showOffline.bind(this);
  }

  showAll() {
    this.setState({
      isAll: 1,
      isOnline: 0,
      isOffline: 0,
    })
  }

  showOnline() {
    this.setState({
      isAll: 0,
      isOnline: 1,
      isOffline: 0,
    })
  }

  showOffline() {
    this.setState({
      isAll: 0,
      isOnline: 0,
      isOffline: 1,
    })
  }

  render() {
    let switchStatus = [this.state.isAll, this.state.isOnline, this.state.isOffline]

    return (
      <div>
        <div className="buttons" >
          <Switch func={"All"} handleClick={this.showAll} />
          <Switch func={"Online"} handleClick={this.showOnline} />
          <Switch func={"Offline"} handleClick={this.showOffline} />
        </div>

        <Channels switchStatus={switchStatus} />
      </div>
    )
  }
}






ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
