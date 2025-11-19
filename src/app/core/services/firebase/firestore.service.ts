import { inject, Injectable } from '@angular/core';
import {
  collectionData,
  deleteDoc,
  doc,
  docData,
  FieldValue,
  Firestore,
  or,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { collection, Timestamp } from '@firebase/firestore';
import { User } from '@angular/fire/auth';

import { Observable } from 'rxjs';
import { Interner } from '../../models/stagiaire.model';
import { Supervisor } from '../../models/superviseur.model';
import { Internship } from '../../models/stage.model';
import { Payment } from '../../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private fs = inject(Firestore);
  internerCol = 'interners';
  supervisorCol = 'supervisors';
  intershipCol = 'intership';
  //todoCol = (projectId: string) => `${this.projectCol}/${projectId}/todos`;
  paymentCol = (intershipId: string) =>
    `${this.intershipCol}/${intershipId}/payments`;

  creasteDocId = (colName: string) => doc(collection(this.fs, colName)).id;
  setInterner(interner: Interner<FieldValue>) {
    const internerColRef = collection(this.fs, this.internerCol);
    const internerDocRef = doc(internerColRef, interner.id);
    return setDoc(internerDocRef, interner, { merge: true });
  }

  SetSupervisor(supervisor: Supervisor<FieldValue>) {
    const supervisorColRef = collection(this.fs, this.supervisorCol);
    const supervisorDocRef = doc(supervisorColRef, supervisor.id);
    return setDoc(supervisorDocRef, supervisor, { merge: true });
  }

  setIntership(internship: Internship<FieldValue>) {
    const internshipColRef = collection(this.fs, this.intershipCol);
    const internshipDocRef = doc(internshipColRef, internship.id);
    return setDoc(internshipDocRef, internship, { merge: true });
  }

  setPayement(payment: Payment<FieldValue>, intershipcol: string) {
    const paymentColRef = collection(this.fs, this.paymentCol(intershipcol));
    const paymentDocRef = doc(paymentColRef, payment.id);
    return setDoc(paymentDocRef, payment, { merge: true });
  }
  getSupervisors() {
    const supervisorColRef = collection(this.fs, this.supervisorCol);
    const querySupervisors = query(
      supervisorColRef,
      orderBy('createdAt', 'desc')
    );
    return collectionData(querySupervisors);
  }

  getInterners() {
    const internerColRef = collection(this.fs, this.internerCol);

    const queryInterners = query(internerColRef, orderBy('createdAt', 'desc'));
    return collectionData(queryInterners);
  }
  getInterships() {
    const intershipColRef = collection(this.fs, this.intershipCol);
    const internshipQuery = query(
      intershipColRef,
      orderBy('createdAt', 'desc')
    );
    return collectionData(internshipQuery);
  }

  // getTodos(projectId: string, todoStatus: string) {
  //   const todoColRef = collection(this.fs, this.todoCol(projectId));
  //   const queryTodos = query(
  //     todoColRef,
  //     where('status', '==', todoStatus),
  //     orderBy('createdAt', 'asc')
  //   );
  //   return collectionData(queryTodos) as Observable<Task<Timestamp>[]>;
  //}
  getInternshipPayments(insternshipId: string) {
    const paymentColeRef = collection(this.fs, this.paymentCol(insternshipId));
    const queryPayments = query(
      paymentColeRef,
      where('intershipId', '==', insternshipId),
      orderBy('date', 'asc')
    );
    return collectionData(queryPayments) as Observable<Payment<Timestamp>[]>;
  }
  getDocData(colName: string, id: string) {
    return docData(doc(this.fs, colName, id));
  }
  deleteData(colName: string, id: string) {
    return deleteDoc(doc(this.fs, colName, id));
  }
  formatedTimestamp = (t?: Timestamp) => (t?.seconds ? t.toDate() : new Date());
}
