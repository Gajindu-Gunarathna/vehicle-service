import "./App.css";
import Appbar from "./components/Appbar";
import Home from "./components/Home";
import Login from "./components/Login"; // import Login component

function App() {
  return (
    <div className="App">
      <Appbar />
      <Home />
      <Login /> {/* add login form here */}
    </div>
  );
}

export default App;
