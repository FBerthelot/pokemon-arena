import React from "react";
import { render, createRoot } from "react-dom";
import styled from "styled-components";
import "./index.css";
import { BrowserRouter, Route } from "react-router-dom";

import ErrorHandler from "./components/errors";
import Welcome from "./components/home/welcome";
import ChoiceForm from "./components/arena/choice/form";
import Arena from "./components/arena/arena";
import Stats from "./components/stats/stats";
import Debug from "./components/debug/debug";

const Container = styled.div`
  font-family: sans-serif;
  min-height: 100vh;
  min-width: 100vw;
`;

const rootElement = document.getElementById("root");

const syncRender = () => {
  console.log("sync rendering");
  render(<App />, rootElement);
};

const asyncRender = () => {
  console.log("async rendering");
  createRoot(rootElement).render(<App async />);
};

const App = ({ async }) => (
  <BrowserRouter>
    <ErrorHandler>
      <Container>
        <Route path="/" exact component={Welcome} />
        <Route path="/arena/choice" exact component={ChoiceForm} />
        <Route path="/arena/:first/:second" exact component={Arena} />
        <Route path="/stats" exact component={() => <Stats async={async} />} />
      </Container>
      <Debug async={async} />
    </ErrorHandler>
  </BrowserRouter>
);

if (window.location.search === "?async") {
  asyncRender();
} else {
  syncRender();
}
