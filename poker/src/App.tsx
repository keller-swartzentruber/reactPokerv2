import './App.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Navigation from './components/navigation.component';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Navigation/>
      </Provider>
    </div>
  );
}

export default App;