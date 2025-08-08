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

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private fs = inject(Firestore);
  internerCol = 'interners';
  //todoCol = (projectId: string) => `${this.projectCol}/${projectId}/todos`;

  creasteDocId = (colName: string) => doc(collection(this.fs, colName)).id;
  setInterner(interner: Interner<FieldValue>) {
    const internerColRef = collection(this.fs, this.internerCol);
    const internerDocRef = doc(internerColRef, interner.id);
    return setDoc(internerDocRef, interner, { merge: true });
  }

  // setTask(projectId: string, t: Task<FieldValue>) {
  //   const todoColRef = collection(this.fs, this.todoCol(projectId));
  //   const todoDocRef = doc(todoColRef, t.id);
  //   return setDoc(todoDocRef, t, { merge: true });
  // }

  getInterners() {
    const internerColRef = collection(this.fs, this.internerCol);

    const queryInterners = query(internerColRef, orderBy('createdAt', 'desc'));
    return collectionData(queryInterners);
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
  getDocData(colName: string, id: string) {
    return docData(doc(this.fs, colName, id));
  }
  deleteData(colName: string, id: string) {
    return deleteDoc(doc(this.fs, colName, id));
  }
  formatedTimestamp = (t?: Timestamp) => (t?.seconds ? t.toDate() : new Date());
}
