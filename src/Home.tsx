import './Home.css';
import React from 'react';
import { FHIRData } from './models/fhirResources';
import { ScreeningSummary } from './models/cqlSummary';
import BusySpinner from './components/busy-spinner/BusySpinner';
// import BusyGroup from './components/busy-spinner/BusyGroup';

interface HomeProps {
    fhirData?: FHIRData,
    screenings?: ScreeningSummary[],
}

interface HomeState {
    
}

export default class Home extends React.Component<HomeProps, HomeState> {

  constructor(props: HomeProps) {
    super(props);
    this.state = {
    };
  }

  public render(): JSX.Element {
    let patient = this.props.screenings?.[0].PatientSummary;
    let screening = this.props.screenings?.[0];

    return (
      <div className="home-view">
        {(patient === undefined) ? '' :
            <p><b>{patient?.Name}</b> ({patient?.Gender}) Age {patient?.Age}</p>
        }
        <div className="welcome">
            <h4>COVID Care Manager</h4>
        </div>
        {(this.props.fhirData === undefined)
            ? <div className="welcome">
                <p>Reading your clinical records...</p>
                <BusySpinner busy={this.props.fhirData === undefined} />
            </div>
        : <div>

          <h5>Risk Summary</h5>
          <p>{JSON.stringify(screening?.RiskSummary).replaceAll(',', ', ')}</p>
          <p>{JSON.stringify(screening?.RiskFactorSummary).replaceAll(',', ', ')}</p>

          <h5>Clinical Data</h5>
          <ul>
          <li>{this.props.fhirData?.conditions?.length ?? 0} Health Issues</li>
          <li>{this.props.fhirData?.medications?.length ?? 0} Medications (active, 1 year)</li>
          <li>{this.props.fhirData?.immunizations?.length ?? 0} Immunizations</li>
          <li>{this.props.fhirData?.procedures?.length ?? 0} Procedures</li>
          <li>{this.props.fhirData?.vitalSigns?.length ?? 0} Vital Signs (3 months)</li>
          <li>{this.props.fhirData?.labResults?.length ?? 0} Lab Results</li>
          </ul>
        </div>
        }
      </div>
    );
  }


}
