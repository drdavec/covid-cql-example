
export interface ScreeningSummary {
  PatientSummary: PatientSummary,
  RiskSummary: RiskSummary,
  RiskFactorSummary: RiskFactorSummary,
}

export interface PatientSummary {
  Name: string,
  Gender: string,
  BirthSex: {
    value: string
  },
  Age: number,
  Race: {
    value: string
  }
}

export interface RiskSummary {
  SeverityClassification: string,
  RiskPercent: number,
  RiskFactorCount: number,
  DiagnosticInterpretation: number,
  ConcerningLabCount: number,
  ConcerningImagingCount: number
}

export interface RiskFactorSummary {
  Cancer: boolean | null,
  CardiovascularDisease: boolean | null,
  ChronicRespiratoryDisease: boolean | null,
  DiabetesType2: boolean | null,
  DownsSyndrome: boolean | null,
  Hypertension: boolean | null,
  Immunosuppression: boolean | null,
  NeurologicDisease: boolean | null,
  Obesity: boolean | null,
  ObstructiveSleepApnea: boolean | null,
  Pregnancy: boolean | null,
  RenalDisease: boolean | null,
  SteroidUsage: boolean | null
}
