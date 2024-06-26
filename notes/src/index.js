import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import Sidebar from "./sidebar";
// import Poems from "./poems";
// import SignIn from "./SignIn";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <Sidebar /> */}
  </React.StrictMode>
);

reportWebVitals();
