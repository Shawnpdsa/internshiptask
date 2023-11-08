import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import TransactionsTable from './component/TransactionsTable'
import Barchart from './component/Barchart';
import Statistics from './component/Statistics';



const App = () => {
  return (
  
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/transactions">Transactions</Link>
            </li>
            <li>
              <Link to="/bar-chart">Bar Chart</Link>
            </li>
            <li>
              <Link to="/statistics">Statistics</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/transactions">
            <TransactionsTable />
          </Route>
          <Route path="/bar-chart">
            <Barchart />
          </Route>
          <Route path="/statistics">
            <Statistics />
          </Route>
          <Route path="/">
            Welcome To Task
          </Route>
        </Switch>
      </div>
    </Router>
  );
}



export default App

