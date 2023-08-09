import './App.css';
import {Routes, Route} from "react-router-dom"
import {useEffect} from "react";
import {useNavigate} from "react-router";
import LoginPage from "./page/loginPage/loginPage";
import Homepage from "./page/homepage/homePage";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
      if (!localStorage.getItem('role')) {
        navigate('/login')
      }
    }, [])

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/homepage" element={<Homepage/>}/>
      </Routes>
    </div>
  );
}

export default App;
