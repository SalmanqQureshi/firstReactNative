import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthToken, setLogoutHandler } from '../ApiService';
import { getCryptoToken } from '../getCryptoToken';
// import {UserType} from '../../types/UserType';
//#region Types and DefaultValues
interface AuthStateType {
  isLoggedIn: boolean;
  user?: any;
  access_token?: string;
}
interface AuthContextType extends AuthStateType {
  logIn: (params: AuthStateType, isLoggedIn: boolean | undefined) => any;
  logOut: () => any;
  setGuest: (params: AuthStateType) => any;
}

interface AuthProviderPropType extends PropsWithChildren {
  PersistVersion: number;
  onLift: (user: any | undefined) => any;
}

const defaultAuthValues: AuthStateType = {
  isLoggedIn: false,
  access_token: ''
};
//#endregion

export const AuthFunction = {}
export const AuthContext = createContext<AuthContextType>({
  ...defaultAuthValues,
  logIn: () => { },
  logOut: () => { },
  setGuest: () => { },
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({
  children,
  PersistVersion = 0,
  onLift = () => { },
}: AuthProviderPropType) => {
  const [Auth, setAuth] = useState<AuthStateType>(defaultAuthValues);
  const [isLoaded, setLoaded] = useState(false);
  const logIn = (user: any, isLoggedIn: boolean | undefined = true) => {
    setAuth(s => ({
      ...s,
      user,
      isLoggedIn,
    }));
  };

  const logOut = () => {
    AsyncStorage.removeItem('auth',()=>{})
    setAuth({user: {}, isLoggedIn: false, access_token: ''});
  };
  useEffect(() => {
    if (isLoaded) {
      onLift(Auth.user);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!PersistVersion) return () => { };
    AsyncStorage.getItem('auth')
      .then(val => {
        if (!val) return;
        const AuthData = JSON.parse(val);
        if (PersistVersion == AuthData.PersistVersion) {
          setAuth(AuthData.data);
        }
      })
      .finally(() => {
        setLoaded(true);
      });
    return () => { };
  }, []);
  useEffect(() => {
    if (!PersistVersion) return () => { };
    AsyncStorage.setItem(
      'auth',
      JSON.stringify({
        data: { isLoggedIn: Auth.isLoggedIn, user: Auth.user },
        PersistVersion: PersistVersion,
      }),
    );
    AuthToken.token = Auth.user?.access_token || '';
    return () => { };
  }, [Auth]);
  useEffect(() => {
    setLogoutHandler(logOut);
  }, [logOut]);
  return (
    //@ts-ignore
    <AuthContext.Provider value={{ ...Auth, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
