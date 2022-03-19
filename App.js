import Navigator from './Routes/LoginStack'
import { ContextProvider } from './ContextAPI/Context';


export default function App() {
  return (
    <ContextProvider>
      <Navigator/>
    </ContextProvider>
  );
}

