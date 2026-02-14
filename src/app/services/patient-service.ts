import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  patients: Patient[] = [
    {
      id: 1,
      name: "Bichin",
      species: "Gato",
      breed: "Común Europeo",
      sex: "Macho",
      owner: "Mauricio Esperon",
      lastVisit: "22-09-2024"
    },
    {
      id: 2,
      name: "Luna",
      species: "Perro",
      breed: "Labrador Retriever",
      sex: "Hembra",
      owner: "Ana López",
      lastVisit: "15-10-2024"
    },
    {
      id: 3,
      name: "Max",
      species: "Perro",
      breed: "Pastor Alemán",
      sex: "Macho",
      owner: "Carlos Ramírez",
      lastVisit: "03-11-2024"
    },
    {
      id: 4,
      name: "Misu",
      species: "Gato",
      breed: "Siames",
      sex: "Hembra",
      owner: "Fernanda Torres",
      lastVisit: "27-08-2024"
    },
    {
      id: 5,
      name: "Rocky",
      species: "Perro",
      breed: "Bulldog Francés",
      sex: "Macho",
      owner: "Luis Hernández",
      lastVisit: "09-12-2024"
    }


  ];

  getPatients() {
    return this.patients;
  }
  addPatient(patient: Patient) {
    this.patients.push(patient);
  }

  deletePatient(id: number) {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients.splice(index, 1);
    }
  }

  updatePatient(updatedPatient: Patient) {
    const index = this.patients.findIndex(p => p.id === updatedPatient.id);

    if (index !== -1) {
      this.patients[index] = updatedPatient;
    }
  }

}

export interface Patient {
  id: number;
  name: string;
  species: string;
  breed: string;
  sex: string;
  owner: string;
  lastVisit?: string;
}
