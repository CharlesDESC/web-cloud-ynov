Web Cloud
Firebase - storage
Cloud Storage
Cloud Storage pour Firebase vous permet de télécharger et de partager du
contenu généré par les utilisateurs, tel que des images et des vidéos, ce qui vous
permet d'intégrer du contenu multimédia riche dans vos applications. Vos données
sont stockées dans un bucket Google Cloud Storage , une solution de stockage
d'objets à l'échelle de l'exaoctet avec une haute disponibilité et une redondance
globale. Cloud Storage pour Firebase vous permet de télécharger ces fichiers en
toute sécurité directement à partir d'appareils mobiles et de navigateurs Web, en
gérant facilement les réseaux irréguliers.
Mettre à jour la photo d’un utilisateur
L’objectif va être d’envoyer sur le storage de firebase une photo de profil, et de
mettre à jour la photo.
Donc on va créer utiliser un file picker, on va créer un référentiel dans storage, on
va envoyer bytes par bytes, et on va récupérer l’url du fichier uploader, pour
modifier les informations de l’utilisateur
Configurer firebase
Direction la console de firebase > Créez > Storage > Commencer > Mode
production
Configurer l’accès
Cloud Storage pour Firebase fournit un langage de règles déclaratives qui vous
permet de définir comment vos données doivent être structurées, comment elles
doivent être indexées et quand vos données peuvent être lues et écrites. Par
défaut, l'accès en lecture et en écriture à Cloud Storage est restreint afin que
seuls les utilisateurs authentifiés puissent lire ou écrire des données.
Règle d’accès
On va changer la règle par défaut dans l’onglet Storage > Règles pour lui donner l’autorisation
en lecture et écriture sur tous les buckets seulement si l’utilisateur est authentifié
service firebase.storage {
match /b/{bucket}/o {
match /{allPaths=\*_} {
allow read, write: if request.auth != null;
}
}
}
Installer les dépendances
npx expo install expo-image-picker
Mettre à jour app.json
"plugins": [
"expo-router",
[
"expo-image-picker",
{
"photosPermission": "The app accesses your photos to let you share them with your friends."
}
]
]
Les références
Vos fichiers sont stockés dans un bucket Cloud Storage . Les fichiers de ce
compartiment sont présentés dans une structure hiérarchique, tout comme le
système de fichiers sur votre disque dur local ou les données de la base de
données Firebase Realtime. En créant une référence à un fichier, votre application
y accède. Ces références peuvent ensuite être utilisées pour télécharger ou
télécharger des données, obtenir ou mettre à jour des métadonnées ou supprimer
le fichier. Une référence peut pointer vers un fichier spécifique ou vers un nœud
de niveau supérieur dans la hiérarchie.
Créez une référence
Afin de télécharger ou de télécharger des fichiers, de supprimer des fichiers ou
d'obtenir ou de mettre à jour des métadonnées, vous devez créer une référence
au fichier sur lequel vous souhaitez opérer. Une référence peut être considérée
comme un pointeur vers un fichier dans le cloud. Les références sont légères,
vous pouvez donc en créer autant que vous le souhaitez, et elles sont également
réutilisables pour plusieurs opérations.
Pour créer une référence, récupérez une instance du service Storage à l'aide de
getStorage() puis appelez ref() avec le service comme argument. Cette référence
pointe vers la racine de votre bucket Cloud Storage.
storage_upload_file.js
import { getStorage, ref, uploadBytes } from "firebase/storage";
export const storage_upload_file.js = (file) => {
const storage = getStorage();
const storageRef = ref(storage, 'some-child');
// 'file' comes from the Blob or File API
uploadBytes(storageRef, file).then((snapshot) => {
console.log('Uploaded a blob or file!');
});
}
expo-image-picker fourni une URI et pas un file …
storage_upload_file.js
import { getStorage, ref, uploadBytes } from "firebase/storage";
export const uploadToFirebase = async (uri, name, onProgress) => {
const fetchResponse = await fetch(uri);
const theBlob = await fetchResponse.blob();
const imageRef = ref(getStorage(), `images/${name}`);
uploadBytes(storageRef, file).then((snapshot) => {
console.log('Uploaded a blob or file!');
});
};
Télécharger un fichier
Cloud Storage pour Firebase vous permet de télécharger rapidement et facilement
des fichiers à partir d'un bucket Cloud Storage fourni et géré par Firebase.
Vous pouvez obtenir l'URL de téléchargement d'un fichier en appelant la méthode
getDownloadURL() sur une référence Cloud Storage.
storage_upload_file.js
import { getStorage, ref, uploadBytes } from "firebase/storage";
export const uploadToFirebase = async (uri, name, onProgress) => {
const fetchResponse = await fetch(uri);
const theBlob = await fetchResponse.blob();
const imageRef = ref(getStorage(), `images/${name}`);
const uploadTask = await uploadBytes(imageRef, theBlob);
const downloadUrl = await getDownloadURL(uploadTask.ref);
return downloadUrl;
};
auth_update_photo_url.js
import app from "../firebaseConfig";
import { getAuth, updateProfile } from "firebase/auth";
const auth = getAuth(app);
export const updateUserPhotoUrl = async (downloardUrl) => {
try {
await updateProfile(auth.currentUser, {photoURL: downloardUrl});
return true;
} catch (e) { return false;}
}
/profile
On va créer une
fonction pickImage
qui va utiliser
ImagePicker grâce à
un import
import _ as
ImagePicker from
'expo-image-picker';
Upload image
On affiche l’image d’origine, puis au onPress on appelle la fonction créé, et enfin
on affiche la nouvelle photo sélectionnée, en cours d’upload
