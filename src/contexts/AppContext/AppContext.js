import React from "react";

const AppContext = React.createContext({});
const AppProvider = AppContext.Provider;

export { AppContext as default, AppProvider };
