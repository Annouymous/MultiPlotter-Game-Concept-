import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged as _onAuthStateChanged,
    updateProfile,
    updateEmail,
  } from "firebase/auth";
import { Auth, DB, Storage } from "./config";
import { User,updatePassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";

export function onAuthStateChanged(cb: (user: User | null) => void) {
    return _onAuthStateChanged(Auth, cb);
  }
export async function signInEmail(email:string,password:string) {
    await signInWithEmailAndPassword(Auth,email,password);
  }
export async function CreateUser(email:string,password:string) {
    await createUserWithEmailAndPassword(Auth,email,password);
 
}
export async function signOut() {
    Auth.signOut();
  }
export async function passwordChange(auth:User, pass:string) {
  updatePassword(auth,pass)
}
export  async function UpdateUseProfile(user:User,url:string) {
  updateProfile(user,{
    photoURL:url
  })
}
export  async function UpdateDisplayName(user:User,name:string) {
  updateProfile(user,{
   displayName:name
  })
}
export  async function UpdateEmail(user:User,Email:string) {
  await updateEmail(user,Email)
}
export async function GetDoc(ref:any) {
  const docRef = doc(collection(DB,'docs'),ref) 
  const data = (await getDoc(docRef)).data()
  return data
}
export async function uploadImage(Path: string, image: File): Promise<string> {
	const filePath = `images/${Path}/${image.name}`;
	const newImageRef = ref(Storage, filePath);
	await uploadBytesResumable(newImageRef, image);
	return await getDownloadURL(newImageRef);
}
