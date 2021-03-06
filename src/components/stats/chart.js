import React from "react";
import { unstable_scheduleCallback as scheduleCallback } from "scheduler";
import styled from "styled-components";

import {
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
  VictoryAxis
} from "victory";

const fetchApi = async () => {
  const response = await fetch(`http://localhost:4200/pokemons/stats`);
  const result = await response.json();
  return result;
};

const Container = styled.div`
  max-width: 600px;
  min-height: 400px;
  width: 100%;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

const InputContainer = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  font-size: 24px;
  border: 2px solid black;
  border-radius: 3px;
  width: 300px;
  text-align: center;
  margin: 10px;
`;

// http://localhost:4200/${datum.name}.gif
// http://www.pokestadium.com/sprites/black-white/${datum.name}.png
const PokemonPoint = ({ x, y, datum, name }) => (
  <image
    href={`http://localhost:4200/black-white/${datum.name}.png`}
    x={x}
    y={y}
    height="20px"
    width="20px"
  />
);

class Chart extends React.Component {
  state = {
    chartData: [],
    count: 10
  };

  changeHandler = event => {
    const { async } = this.props;
    const count = parseInt(event.target.value, 10);

    if (async) {
      console.log("async update");
      scheduleCallback(() => this.setState({ count }));
    } else {
      console.log("sync update");
      this.setState({ count });
    }
  };

  componentDidMount() {
    fetchApi().then(pokemonData =>
      this.setState(() => ({
        chartData: pokemonData.map(data => ({
          x: data.attack,
          y: data.defense,
          z: data.speed,
          name: data.name
        }))
      }))
    );
  }

  render() {
    const { chartData, count } = this.state;
    const data = chartData.slice(0, count);

    return (
      <Container>
        <InputContainer>
          Show first
          <Input type="number" value={count} onChange={this.changeHandler} />
          Pokemons:
        </InputContainer>
        <VictoryChart
          theme={VictoryTheme.material}
          domain={{ x: [0, 200], y: [0, 200] }}
        >
          <VictoryAxis label="Attack" />
          <VictoryAxis dependentAxis label="Defense" />
          <VictoryScatter data={data} dataComponent={<PokemonPoint />} />
        </VictoryChart>
      </Container>
    );
  }
}

export default Chart;
