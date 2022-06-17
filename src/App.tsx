import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Layouts/Layout.component";
import DefaultPageAsFunction from "./Pages/Default/DefaultAsFunction.page";
import DefaultPageAsClass from "./Pages/Default/DefaultAsClass.page";
import routes from "Routes";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Navigate to={routes.defaultAsFunction} replace /> }></Route>
                <Route path={routes.defaultAsFunction} element={<DefaultPageAsFunction />} />
                <Route path={routes.defaultAsClass} element={<DefaultPageAsClass />} />
            </Route>
        </Routes>
    );
}

export default App;
