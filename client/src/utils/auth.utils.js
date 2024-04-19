import {
    getAuth,
    signInWithPopup,
    OAuthProvider,
    signOut,
    onAuthStateChanged,
    reauthenticateWithPopup
} from "firebase/auth";
import { app } from "../../firebase.config";

const auth = getAuth();

const signInWithMicrosoft = () => {
    const provider = new OAuthProvider("microsoft.com");

    provider.setCustomParameters({
        tenant: "c7b00d7f-ad99-442a-b12f-c2c912044fdc",
    });

    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = OAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            const idToken = credential.idToken;
        })
        .catch((error) => {
            console.log("Error occured ", error);
        });
};

const signOutWithMicrosoft = () => {
    signOut(auth)
        .then(() => {
            console.log("Signed out");
            localStorage.removeItem("userId")
        })
        .catch((error) => {
            console.log("Error occurred ", error);
        });
};

const getUser = () => {
    let userObj = {}
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userObj.displayName = user.displayName;
            userObj.email = user.email;
            userObj.photoURL = user.photoURL;
            console.log("user object: ", userObj)
            return userObj
        } else {
            console.log("User is not loggedin")
        }

    });
};

export {
    signInWithMicrosoft,
    signOutWithMicrosoft,
    getUser,
    auth,
}