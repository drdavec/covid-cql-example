import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import {Switch, Route } from "react-router-dom";

import Home from "./Home";
import { FHIRData } from './models/fhirResources';
import { ScreeningSummary } from './models/cqlSummary';
import { getFHIRData } from './service/fhirService';
import { executeCovidScreening } from './service/cqlService';
import { ErrorPage } from "./components/error-page/ErrorPage";

interface AppProps {

}

interface AppState {
  fhirData?: FHIRData,
  screenings?: ScreeningSummary[],
  ErrorMessage?: string
}

export default class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            fhirData: undefined,
        }
    }

    componentDidMount() {
        getFHIRData().then((data: FHIRData) => {
            this.setState({ fhirData: data, screenings: executeCovidScreening(data) })
        })
    }

    public render(): JSX.Element {
        return (
            <div className="app">
            <Switch>
                <Route path="/error" component= { ErrorPage }/>

                {/* If none of the previous routes render anything,
                    this route acts as a fallback. */}
                <Route path="/">
                    <Home {...this.state} />
                </Route>
            </Switch>
            </div>
        )
    }
}