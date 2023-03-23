import { createContext, useState } from "react";

export const Context = createContext('')

export const ContextProvider = (props) => {
    const [userId, setUserId] = useState('');
    const [teamsNameMap, setMap] = useState(new Map());
    const [getToken,setToken] = useState('')
    const [getRoute,setRoute] = useState()



    return (
        <Context.Provider value={{ userId: [userId, setUserId], teamsMap: [teamsNameMap, setMap],token:[getToken,setToken],route:[getRoute,setRoute] }}>
            {props.children}
        </Context.Provider>
    )
}