import React from 'react';
import ReactDOM from 'react-dom/client';
import "./tailwind.css"
import GridDashboard from "./GridDashboard.tsx";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
            <GridDashboard />
    </React.StrictMode>
);
