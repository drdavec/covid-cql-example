import { fhirclient } from 'fhirclient/lib/types';
import { Condition, Immunization, MedicationRequest, 
  Observation, Patient, Practitioner, Procedure } from '../fhir-types/fhir-r4';

export interface FHIRResource {
  resource: fhirclient.JsonObject,
}
  
export interface FHIRData {
  patient: Patient,
  practitioner?: Practitioner,
  conditions?: [Condition],
  immunizations?: [Immunization],
  medications?: [MedicationRequest],
  procedures?: [Procedure],
  labResults?: [Observation],
  vitalSigns?: [Observation],
}
