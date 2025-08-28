import "./App.css";
import GameContainer from "./components/GameContainer";

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-black pt-[50px]">
      <h1 className="text-6xl font-black text-white font-mono tracking-widest mb-8 text-shadow-lg">
        TETRIS
      </h1>
      <GameContainer />
    </div>
  );
}

export default App;
