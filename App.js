import Navigator from './Routes/LoginStack'
import { ContextProvider } from './ContextAPI/Context';
import { Provider } from 'react-redux'
import {store} from './Redux/Store'




export default function App() {
  return (

    <Provider store={store}>
    <ContextProvider>
      <Navigator/>
    </ContextProvider>
    </Provider>

  );
}

