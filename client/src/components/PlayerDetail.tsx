import * as React from 'react';
import {Route} from "react-router";
import PlayerMenu from "./PlayerMenu";
import {Player} from "../models/player";
import axios from "axios";

class PlayerDetail extends React.Component {
  public state: any = {
    player: null,
    player_id: null,
    uuid: ""
  };

  public componentDidMount() {
    this.setState(
      {
        uuid: window.localStorage.getItem('eamon_uuid'),
        player_id: window.localStorage.getItem('player_id')
      },
      () => {
        // get the player from the API
        axios.get('/api/players/' + this.state.player_id + '.json?uuid=' + this.state.uuid)
          .then(res => {
            console.log('player data from api', res.data);
            const player = new Player();
            player.init(res.data);
            player.update();
            this.setState({player});
          });
      });
  }

  public render() {
    // TODO: show the saved game list here...
    // const extraProps = { player: this.state.player};
    return (
      <div className="container-fluid" id="PlayerDetail">
        <Route path="/main-hall/hall" render={(props) => (
          <PlayerMenu {...props} player={this.state.player}/>
        )}/>
      </div>
    );
  }
}

export default PlayerDetail;
