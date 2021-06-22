// @ts-ignore
import cql from 'cql-execution';
// @ts-ignore
import cqlfhir from 'cql-exec-fhir';

import { Resource } from '../fhir-types/fhir-r4';
import { FHIRData } from '../models/fhirResources';
import { ScreeningSummary } from '../models/cqlSummary';

import { screeningLibraries, codeService } from './cqlLibraries';

function getBundleEntries(resources?: [Resource]) {
  return resources?.map((r: Resource) => ({ resource: r })) || []
}

function getPatientSource(data: FHIRData): unknown {
  const fhirBundle = {
    resourceType: 'Bundle',
    entry: [{ resource: data.patient }, { resource: data.practitioner },
      ...getBundleEntries(data.conditions),
      ...getBundleEntries(data.procedures),
      ...getBundleEntries(data.medications),
      ...getBundleEntries(data.immunizations),
      ...getBundleEntries(data.labResults),
      ...getBundleEntries(data.vitalSigns),
    ]
  };

  const patientSource = cqlfhir.PatientSource.FHIRv401();
  patientSource.loadBundles([fhirBundle]);

  return patientSource;
}

export const executeCovidScreening = (fhirData: FHIRData): ScreeningSummary[] => {
  return screeningLibraries.map((library: any) => (
    executeScreeningLibrary(library, getPatientSource(fhirData))
  )) as ScreeningSummary[]
}

const executeScreeningLibrary = (library: any, patientSource: any): ScreeningSummary => {
  const executor = new cql.Executor(library, codeService);
  const results = executor.exec(patientSource);
  const extractedSummary = results.patientResults[Object.keys(results.patientResults)[0]];
  const screeningSummary = extractedSummary as ScreeningSummary;
  // console.log("ScreeningSummary: " + JSON.stringify(screeningSummary.RiskFactorSummary));

  return screeningSummary;
}

// TODO: this function to execution a single CQL expression was copied, but must be updated for this app.

/*
const executeCQLExpression = (libraryToExecute: cql.Library, parameters: CQLExpressionParameters, expressionName: string): unknown => {
  const expressionExecutor = new cql.Executor(libraryToExecute, codeService, parameters);

  const results = expressionExecutor.exec_expression(expressionName, getPatientSource(globals.fhirData as FHIRData));

  const patientResults = Object.keys(results.patientResults);
  const firstPatientResult = patientResults[0];
  const expressions = results.patientResults[firstPatientResult];

  return expressions[expressionName];
};
*/
