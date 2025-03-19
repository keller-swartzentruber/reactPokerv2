import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from '../app/routes';


const Navigation = () => {
    const routes = AppRoutes();

    return <>
        <Suspense fallback={<div> we're in the fallback zone </div>}>
            <Routes>
                {routes.map(route => {
                    return <Route key={route.name} path={route.path} element={route.element} > </Route>
                })}
            </Routes>
        </Suspense>
    </>;
};

export default Navigation;