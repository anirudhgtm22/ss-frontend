// import React from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import Navbar from './components/navbar';
// import Homepage from './components/Homepage';
// import Routes from './components/router';

// function App() {
//   return (
//     <div className="App">
//       <Router>
//         <Navbar />
//         <Homepage />
//         <Routes/>
//       </Router>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/navbar';
import NavLink from './components/router';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <NavLink />
      </Router>
    </div>
  );
}

export default App;
