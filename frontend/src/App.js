import './App.css';
import Navbar from "./components/NavBar"
import PageLanding from "./components/PageLanding"
import Footer from "./components/Footer"
import TimeLine from "./components/TimeLine"

function App() {
  return (
    <div className="App">
      <Navbar />
      <PageLanding />
      <TimeLine />
      <Footer />
    </div>
  );
}

export default App;
