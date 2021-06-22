// @ts-ignore
import cql from 'cql-execution';

import FHIRHelpers from '../cql/FHIRHelpers.json';
import CDSConnectCommons from '../cql/CDSConnectCommons.json';
import COVID19Concepts from '../cql/COVID19Concepts.json';
import COVID19EmergencyDeptAssessment from '../cql/COVID19EmergencyDeptAssessment.json';
import COVID19EDSummary from '../cql/COVID19EmergencyDeptSummary.json';
import valueSetDB from '../cql/valueset-db.json';

const getCovidSummaryLibrary = () => new cql.Library(COVID19EDSummary, new cql.Repository({
  COVID19EmergencyDeptAssessment,
  COVID19Concepts,
  CDSConnectCommons,
  FHIRHelpers,
}));

export const codeService = new cql.CodeService(valueSetDB);
export const covidSummaryLibrary = getCovidSummaryLibrary();

export const screeningLibraries = [
  covidSummaryLibrary,
]