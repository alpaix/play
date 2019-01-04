import { applyMiddleware, compose, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import merge from "deepmerge";

import epics from "./epics";
import reducer from "./reducer";
import getInitialState from "./getInitialState";
import { errorMiddleware } from "./middlewares";

type State = {
  ui: {
    repo: string;
    gitref: string;
    source: string;
    showPanel: boolean;
    currentServerId: string;
    currentKernelName: string;
    platform: string;
  };
  entities: {
    serversById: any;
  };
};

export default function(givenInitialState: Partial<State> = {}) {
  const initialState = merge(getInitialState(), givenInitialState);
  const epicMiddleware = createEpicMiddleware();
  const composeEnhancers =
    (typeof window !== "undefined" &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(epicMiddleware, errorMiddleware))
  );
  epicMiddleware.run(epics);
  return store;
}
