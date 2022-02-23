import React, { lazy, Suspense } from "react";
import { Route, Switch, useRouteMatch } from 'react-router';
import Loader from "../../components/utilitiies/Loader";
import MainLayout from '../../layouts/mainLayout';


const Posts = lazy(() => import("./postRoutes"));
const Page = lazy(() => import("./pagesRoutes"));
const Config = lazy(() => import("./configRoutes"));

export default function AdminRoutes() {
    const { path } = useRouteMatch();
    return (
        <MainLayout>
            <Suspense fallback={<Loader />}>

                <Switch>
                    <Route path={`${path}/posts`} component={Posts} />
                    <Route path={`${path}/page`} component={Page} />
                    <Route path={`${path}/config`} component={Config} />
                </Switch>
            </Suspense>
        </MainLayout>
    )
}
