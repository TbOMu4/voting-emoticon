import React, { Component } from "react";
import smile1 from "../assets/1.png";
import smile2 from "../assets/2.png";
import smile3 from "../assets/3.png";
import smile4 from "../assets/4.png";
import smile5 from "../assets/5.png";

class VotingEmoticon extends Component {
  constructor(props) {
    super(props);

    const savedVotes = JSON.parse(localStorage.getItem("votes"));
    this.state = {
      votes: savedVotes || {
        smile1: 0,
        smile2: 0,
        smile3: 0,
        smile4: 0,
        smile5: 0,
      },
      showWinner: false,
    };

    this.smileImages = {
      smile1,
      smile2,
      smile3,
      smile4,
      smile5,
    };
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.votes !== this.state.votes) {
      localStorage.setItem("votes", JSON.stringify(this.state.votes));
    }
  }

  resetVoting = () => {
    const resetVotes = {
      smile1: 0,
      smile2: 0,
      smile3: 0,
      smile4: 0,
      smile5: 0,
    };
    this.setState({
      votes: resetVotes,
      showWinner: false,
    });
    localStorage.setItem("votes", JSON.stringify(resetVotes));
  };

  handleClick = (smileKey) => {
    if (this.state.showWinner) return;
    this.setState((prevState) => ({
      votes: {
        ...prevState.votes,
        [smileKey]: prevState.votes[smileKey] + 1,
      },
    }));
  };

  getWinner = () => {
    const { votes } = this.state;
    let maxVotes = -1;
    let winners = [];

    for (const [key, value] of Object.entries(votes)) {
      if (value > maxVotes) {
        maxVotes = value;
        winners = [key];
      } else if (value === maxVotes) {
        winners.push(key);
      }
    }

    return { winners, maxVotes };
  };

  showWinner = () => {
    this.setState({ showWinner: true });
  };

  render() {
    const { votes } = this.state;
    const { winners, maxVotes } = this.getWinner();
    return (
      <div className="flex flex-col items-center justify-center text-center gap-10">
        <h1 className="text-[24px] mt-8">Голосування за найкращий смайлик</h1>
        <div className="flex flex-col items-center justify-center ">
          <div className="flex gap-4 mb-10">
            {Object.entries(this.smileImages).map(([key, img]) => (
              <button className="cursor-pointer w-30" key={key} onClick={() => this.handleClick(key)}>
                <img src={img} alt={key} />
                <span>{votes[key]}</span>
              </button>
            ))}
          </div>
          <div className="">
            <button className="p-5 rounded-4xl bg-amber-300 hover:bg-amber-400 cursor-pointer mb-10" onClick={this.showWinner}>
              Показати результат
            </button>
            {this.state.showWinner && (
              <div>
                <p>Переможець:</p>
                {winners.length > 1 ? (
                  <div>
                    <p>Є кілька переможців з рівною кількістю голосів:</p>
                    <div className="flex  items-center justify-center">
                      {winners.map((winnerKey) => (
                        <div className=" w-30" key={winnerKey}>
                          <img src={this.smileImages[winnerKey]} alt={winnerKey} />
                          <span>{maxVotes} голосів</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <img src={this.smileImages[winners[0]]} alt={winners[0]} />
                    <span>{maxVotes} голосів</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="p-5 rounded-4xl bg-amber-300 hover:bg-amber-400 cursor-pointer" onClick={this.resetVoting}>
            Скинути результати
          </button>
        </div>
      </div>
    );
  }
}

export default VotingEmoticon;
