import { createContext, useState } from "react";

export const Context = createContext('')

export const ContextProvider = (props) => {
    const [userId, setUserId] = useState('');
    const [teamsNameMap, setMap] = useState(new Map());




    return (
        <Context.Provider value={{ userId: [userId, setUserId], teamsMap: [teamsNameMap, setMap] }}>
            {props.children}
        </Context.Provider>
    )
}