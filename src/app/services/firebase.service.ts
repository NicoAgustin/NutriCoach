import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage'
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from '@firebase/storage';
import { RegistroMedicion } from '../models/medicion.model';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private storage: AngularFireStorage,
    private utilSvc: UtilsService
  ) { }

  //Firebase Authentication

  login(correo: string, pass: string) {
    return this.auth.signInWithEmailAndPassword(correo, pass)
  }

  signUp(correo: string, pass: string) {
    return this.auth.createUserWithEmailAndPassword(correo, pass)
  }

  async signOut() {
    await this.auth.signOut()
    this.router.navigate(['/home'])
  }

  resetPassword(correo: string) {
    return this.auth.sendPasswordResetEmail(correo)
  }

  getAuthState() {
    return this.auth.authState
  }

  enviarCodigoReset(correo: string) {
    return this.auth.sendPasswordResetEmail(correo)
  }

  async eliminarCuenta() {
    const user = await this.auth.currentUser
    await user.delete()
  }

  //Firestore  (Base de Datos)

  // getSubcollection(path: string, subcollectionName: string) {
  //   return this.db.doc(path).collection(subcollectionName).valueChanges()
  // }

  async getSubcollection(path: string, uid: string, sub: string){
    return this.db.collection(path).doc(uid).collection(sub).snapshotChanges()
  }

  async getSubcollection2(path: string, uid: string, sub: string){
    return this.db.collection(path).doc(uid).collection(sub).get()
  }

  async addSubcollection(path: string, uid: string, sub: string, registro: any){
    this.db.collection(path).doc(uid).collection(sub).add(registro)
  }

  async updateSubcollection(path: string, uid: string, sub: string, doc: string, registro: any){
    this.db.collection(path).doc(uid).collection(sub).doc(doc).update(registro)
  }

  async deleteDocSubcollection(path: string, uid: string, sub: string, doc: string){
    this.db.collection(path).doc(uid).collection(sub).doc(doc).delete()
  }

  async getDocInSubcollection(path: string, uid: string, sub: string, key: string, value: string){
    return this.db.collection(path).doc(uid).collection(sub, ref => ref.where(key, '==', value)).get().toPromise()
  }


  async setDocument(path: string, uid: string, registro: any) {
    this.db.collection(path).doc(uid).set(registro)
  }

  async getDocument(path: string, uid: string) {
    return this.db.collection(path).doc(uid).get()
  }

  async deleteDocument(path: string, uid: string) {
    return this.db.collection(path).doc(uid).delete()
  }

  async updateDocument(path: string, uid: string, registro: any) {
    this.db.collection(path).doc(uid).update(registro)
  }

  async deleteDocumentInCollection(path1: string, path2: string, uid: string) {
    await (await this.db.collection(path1).doc(uid).collection(path2).get().toPromise()).forEach(async (doc) => {
      await doc.ref.delete();
    });

  }

  async setMatricula(uid: string, numero: number, imagen: string) {
    this.db.collection('Matriculas').doc(uid).set({
      numero: numero,
      imagen: imagen,
      validada: false
    })
  }

  async uploadImage(path: string, dataURL: string) {
    return uploadString(ref(getStorage(), path), dataURL, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  async deleteImage(path: string) {
    const storage = getStorage();
    const imageRef = ref(storage, path);
    try {
      await deleteObject(imageRef);
      console.log(`Imagen en ${path} eliminada con éxito.`);
    } catch (error) {
      console.error(`Error al eliminar la imagen en ${path}: ${error.message}`);
    }
  }

  async getRegistro(uid: string, path1: string, path2: string) {
    return this.db.collection(path1).doc(uid).collection(path2, ref => ref.where('fecha', '>=', this.utilSvc.getFechaDesde(6))).valueChanges()
  }

  async getRegistroNutri(uid: string, path1: string, path2: string) {
    return this.db.collection(path1).doc(uid).collection(path2, ref => ref.where('fecha', '>=', this.utilSvc.getFechaDesde(6))).get().toPromise()
  }

  async getRegistroFecha(uid: string, path1: string, path2: string, fecha: string){
    return this.db.collection(path1).doc(uid).collection(path2, ref => ref.where('fecha', '>=', fecha)).get().toPromise()
  }

  async getRegistroOrdenado(uid: string, path1: string, path2: string){
    return this.db.collection(path1).doc(uid).collection(path2, ref => ref.orderBy('fecha', 'desc').limit(2)).get().toPromise()
  }

  async deleteRegistroNutri(uid: string, path1: string, path2:string, id: string){
    await this.db.collection(path1).doc(uid).collection(path2).doc(id).delete()
  }

  async setRegistro(uid: string, path1: string, path2: string, registro: any) {
    this.db.collection(path1).doc(uid).collection(path2).add(registro)
  }

  uploadFile(file: File, id: string): Promise<string> {
    const folderName = id;
    const filePath = `${folderName}/receta.pdf`;

    const fileRef = this.storage.ref(filePath);
    return fileRef.put(file).then((snapshot) => {
      return snapshot.ref.getDownloadURL();
    });
  }

    }
