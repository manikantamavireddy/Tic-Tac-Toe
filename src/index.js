import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  return (
    <div>
      <div className="board-row">
        <Square value={props.squares[0]} onClick={()=>props.onClick(0)}/>
        <Square value={props.squares[1]} onClick={()=>props.onClick(1)}/>
        <Square value={props.squares[2]} onClick={()=>props.onClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={props.squares[3]} onClick={()=>props.onClick(3)}/>
        <Square value={props.squares[4]} onClick={()=>props.onClick(4)}/>
        <Square value={props.squares[5]} onClick={()=>props.onClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={props.squares[6]} onClick={()=>props.onClick(6)}/>
        <Square value={props.squares[7]} onClick={()=>props.onClick(7)}/>
        <Square value={props.squares[8]} onClick={()=>props.onClick(8)}/>
      </div>
    </div>
  );
}

function whoIsWinner(squares){
  let lines=[
    [0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,4,6],[2,5,8],[3,4,5],[6,7,8]
  ];
  return lines.filter(item=>item.every(i=>squares[i]===squares[item[0]] && squares[i]!==null)).length;
}
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      player1: '',
      player2: '',
      submit: false,
      xIsNext: true,
      step: 0,
      history: [{
        squares : Array(9).fill(null)
      }]
    };
    this.handleChange1=this.handleChange1.bind(this);
    this.handleChange2=this.handleChange2.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
  }
  handleChange1(event){
    this.setState({player1: event.target.value});
  }
  handleChange2(event){
    this.setState({player2: event.target.value});
  }
  handleSubmit(event){
    this.setState({submit: true});
  }
  handleClick(i){
    const history=this.state.history.slice(0,this.state.step+1);
    const current = history[history.length-1];
    const square=current.squares.slice();
    if(whoIsWinner(square) || square[i])
      return;
    square[i]=this.state.xIsNext?'X':'O';
    this.setState({
      history:history.concat([{squares:square}]),
      xIsNext:!this.state.xIsNext,
      step:history.length
    });
  }
  jumpTo(move){
    this.setState({
      step: move,
      xIsNext: (move%2)===0
    });
  }
  render() {
    const history=this.state.history;
    const current = history[this.state.step];
    const winner= whoIsWinner(current.squares);
    const moves= history.map((step,move)=>{
      const disc=move>1?'Go to Move '+(move-1):'Go to game start';
      if(move){
        return(
        <li key={move-1}>
          <button onClick={()=>this.jumpTo(move-1)}>{disc}</button>
        </li>
        );
      }
      return null
    });
    let status;
    if(winner){
      status='Winner is '+(this.state.xIsNext?(this.state.player2+ ' (O)'):(this.state.player1+' (X)'));
    }
    else{
      status = 'Next player: '+ (this.state.xIsNext?(this.state.player1 +' (X)'):(this.state.player2)+' (O)');
    }
    return (
      this.state.submit?
        <div className="game">
          <div className="game-board">
            <Board onClick={(i)=>this.handleClick(i)} squares={current.squares}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div> :
          <form onSubmit={this.handleSubmit} className='playerForm'>
            <label>Player1 :&nbsp;
              <input type='text' value={this.state.player1} onChange={this.handleChange1} required/>
            </label>
            <label>Player2 :&nbsp;
              <input type='text' value={this.state.player2} onChange={this.handleChange2} required/>
            </label>
            <button type='submit' value='submit'>submit</button>
          </form>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);