import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';
import { Resource, Patient, Practitioner, Condition, Observation,
        Procedure, Immunization, MedicationRequest } from '../fhir-types/fhir-r4';
import { FHIRData } from '../models/fhirResources';
// import { properties } from './properties';
import { format } from 'date-fns';

const resourcesFrom = (response: fhirclient.JsonObject): Resource[] => {
  const entries = (response[0] as fhirclient.JsonObject)?.entry as [fhirclient.JsonObject];
  return entries?.map((entry: fhirclient.JsonObject) => entry.resource as any)
                .filter((resource: Resource) => resource.resourceType !== 'OperationOutcome');
};
  
// TODO full date argument does not work correctly in Logica?  Use only yyyy-MM for now.
// export const getDateParameter = (d: Date): string => `ge${format(d, 'yyyy-MM-dd')}`;
export const getDateParameter = (d: Date): string => `ge${format(d, 'yyyy-MM')}`;
const today: Date = new Date()
const oneDay = 24*3600*1000
const threeMonthsAgo = new Date(today.getTime() - (365/4 * oneDay))
// const sixMonthsAgo = new Date(today.getTime() - (365/2 * oneDay))
const oneYearAgo = new Date(today.getTime() - (365 * oneDay))

const conditionsPath = 'Condition?category=problem-list-item&clinical-status=active';
const immunizationsPath = 'Immunization';
const labResultsPath = 'Observation?category=laboratory';
const medicationRequestPath = 'MedicationRequest?status=active&authoredon=' + getDateParameter(oneYearAgo);
const proceduresPath = 'Procedure';
const vitalSignsPath = 'Observation?category=vital-signs&date=' + getDateParameter(threeMonthsAgo);

const fhirOptions: fhirclient.FhirOptions = {
  pageLimit: 0,
};

export const getFHIRData = async (): Promise<FHIRData> => {
  const client = await FHIR.oauth2.ready();

  function hasScope(resourceType: string) {
    // Use lower case for compare - Epic returns, e.g. Condition.Read
    return client?.state.tokenResponse?.scope?.toLowerCase().includes(resourceType.toLowerCase())
  }

  const patient: Patient = await client.patient.read() as Patient;
  const pcpPath = patient.generalPractitioner ? patient.generalPractitioner?.[0]?.reference : undefined;
  const practitioner: Practitioner | undefined = pcpPath ? await client.request(pcpPath) : undefined;

  // Authentication form allows patient to un-select individual types from allowed scope
  const conditions = (hasScope('Condition.read')
    ? resourcesFrom(await client.patient.request(conditionsPath, fhirOptions) as fhirclient.JsonObject)
    : undefined) as [Condition];
  const procedures = (hasScope('Procedure.read')
    ? resourcesFrom(await client.patient.request(proceduresPath, fhirOptions) as fhirclient.JsonObject) 
    : undefined) as [Procedure];
  const immunizations = (hasScope('Immunization.read')
    ? resourcesFrom(await client.patient.request(immunizationsPath, fhirOptions) as fhirclient.JsonObject) 
    : undefined) as [Immunization];
  const labResults = (hasScope('Observation.read')
    ? resourcesFrom(await client.patient.request(labResultsPath, fhirOptions) as fhirclient.JsonObject) 
    : undefined) as [Observation];
  const medications = (hasScope('MedicationRequest.read')
    ? resourcesFrom(await client.patient.request(medicationRequestPath, fhirOptions) as fhirclient.JsonObject) 
    : undefined) as [MedicationRequest];
  const vitalSigns = (hasScope('Observation.read')
    ? resourcesFrom(await client.patient.request(vitalSignsPath, fhirOptions) as fhirclient.JsonObject) 
    : undefined) as [Observation];

  return {
    patient,
    practitioner,
    conditions,
    immunizations,
    medications,
    labResults,
    procedures,
    vitalSigns,
  };
};
