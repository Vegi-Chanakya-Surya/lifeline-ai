import { db } from "./firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

export async function getLatestRecord(uid) {
  const q = query(
    collection(db, "users", uid, "healthForms"),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getAllRecords(uid) {
  const q = query(
    collection(db, "users", uid, "healthForms"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getRecordById(uid, recordId) {
  const ref = doc(db, "users", uid, "healthForms", recordId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
