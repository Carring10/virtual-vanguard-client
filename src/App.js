import "./pages/Feed/feed.css";
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { Discover } from './pages/Discover/Discover';
import { Giveaways } from './pages/Giveaways/Giveaways';
import { Profile } from './pages/Profile/Profile';
import { Feed } from './pages/Feed/Feed';
import { Article } from './pages/Article/Article';
import { Register } from './pages/Register/Register';
import { Game } from './pages/Game/Game';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='/discover' element={<Discover />} />
          <Route path='/giveaways' element={<Giveaways />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/article' Component={Article} />
          <Route path='/register' element={<Register />} />
          <Route path='/game' element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
