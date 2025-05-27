import { create } from 'zustand';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const providerGoogle = new GoogleAuthProvider();
const provideFacebook = new FacebookAuthProvider();

const useAuthStore = create((set) => {
    const observeAuthState = () => {
        onAuthStateChanged(auth, (user) => {
            user ? set({ userLogged: user }) : set({ userLogged: null });
        });
    };
    observeAuthState();
    

        
    return{
        userLogged: null,

        loginGoogleWithPopUp: async() =>{
            try{
                return await signInWithPopup(auth,providerGoogle);

            }catch(error){
                console.error("sign in error: ", error)

            }
        },
        loginFacebookWithPopUp: async()=>{
            try{
                return await signInWithPopup(auth,provideFacebook)
            }catch(error){
                console.error("sign in error: ", error)
            }
        },
        logoutAuth: async() =>{
            return await signOut(auth)
            .then(()=>set({userLogged: null}))
            .error((error)=>console.error("Error in Logout: ",error));

        },
    }

});

export default useAuthStore;