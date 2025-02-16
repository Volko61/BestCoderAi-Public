import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { app, auth, db } from '../config/firebase';
import { getPremiumStatus } from '../config/getPremiumStatus';

interface UserContextType {
    user: any;
    setUser: (user: any) => void;
    isPremium: boolean;
    setIsPremium: (isPremium: boolean) => void;
}


const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const checkPremiumStatus = async () => {
            if (user) {
                const isPremium = await getPremiumStatus(app);
                setIsPremium(isPremium);
            }
        };
        checkPremiumStatus();
    }, [user]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{
            user, setUser, isPremium, setIsPremium
        }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserProvider;