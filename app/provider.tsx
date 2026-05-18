'use client'
import { Provider } from "react-redux";
import {persist_store, store} from "@/redux/store";
import {ReactNode} from "react";
import {PersistGate} from "redux-persist/integration/react";

interface ProviderProps{
    children: ReactNode
}

export default function Providers({children}: ProviderProps){
    return (
        <Provider store={store}>
            <PersistGate persistor={persist_store}>
                {children}
            </PersistGate>
        </Provider>
    )
}