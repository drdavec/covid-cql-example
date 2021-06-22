import FHIR from 'fhirclient';

const epicScope = "launch openid patient/Patient.read patient/Practitioner.read patient/Condition.read patient/DiagnosticReport.read patient/Observation.read patient/Procedure.read patient/CarePlan.read patient/Goal.read patient/Immunization.read patient/MedicationRequest.read";

FHIR.oauth2.authorize([
    {
        // Logica sandbox
        issMatch: /\blogicahealth\b/i,
        redirectUri: "./index.html",
        clientId: process.env.REACT_APP_CLIENT_ID_logica,
        scope: "launch launch/patient fhirUser patient/Patient.read patient/Practitioner.read patient/Condition.read patient/Observation.read patient/Procedure.read patient/Immunization.read patient/MedicationRequest.read"
    },
    {
        // Cerner sandbox
        issMatch: "https://fhir-myrecord.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d",
        redirectUri: "./index.html",
        clientId: process.env.REACT_APP_CLIENT_ID_cerner,
        scope: "launch/patient openid fhirUser online_access patient/Patient.read user/Practitioner.read patient/Condition.read patient/Observation.read patient/Procedure.read patient/Goal.read patient/Immunization.read patient/MedicationRequest.read"
    },
    {
        // Epic sandbox
        issMatch: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
        redirectUri: "./index.html",
        clientId: process.env.REACT_APP_CLIENT_ID_epic_sandbox,
        scope: epicScope
    }

    /*
    {
        // This config will be used if the ISS is local
        issMatch: iss => iss.startsWith("http://localhost") || iss.startsWith("http://127.0.0.1"),
        redirectUri: "./index.html",
        clientId: "my_local_client_id",
        scope: "...",
        patientId: "123", // include if you want to emulate selected patient ID
        encounterId: "234", // include if you want to emulate selected encounter ID
        launch: "whatever",
        fakeTokenResponse: { // include if you want to emulate current user
            // We are only parsing the JWT body so tokens can be faked like so
            id_token: `fakeToken.${btoa('{"profile":"Practitioner/345"}')}.`
        }
    }
    */
]);
