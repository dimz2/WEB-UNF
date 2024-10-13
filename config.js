import { getStorage, ref, uploadBytes, getDownloadURL, getMetadata, listAll, deleteObject } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { storage } from './src/firebase.js';  
import fs from 'fs';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

global.whatsapp = "6282139672290"
global.user = { username: 'user1', password: 'password1' }; 
global.apikey = "dimdogrgb";

global.uploadFile = async(fileBuffer, fileName) => {
  try {
    const storageRef = ref(storage, `upload/${fileName}`);
    const snapshot = await uploadBytes(storageRef, fileBuffer);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { snapshot, downloadURL };
  } catch (error) {
    return error;
  }
};

global.getListFiles = async() => {
	try {
    const storageRef = ref(storage, "upload/");  
    const imagesList = await listAll(storageRef);
    const imageURLs = await Promise.all(
      imagesList.items.map(async (item) => {
        const url = await getDownloadURL(item); 
        const metadata = await getMetadata(item); 
        
       //console.log(metadata);
        return {
          ...metadata, 
          url
        };
      })
    );

    return imageURLs
  } catch (error) {
    console.error("Error fetching images from Firebase Storage:", error);
  }
	};
	
global.deleteFiles = async(fileName) => {
	try {
	const fileRef = ref(storage, 'upload/'+fileName);
let anu = await deleteObject(fileRef);
return anu;
} catch(e) {
	return e;
	}
	};