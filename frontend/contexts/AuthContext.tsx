import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import { authAPI } from '@/services/api';

// ── Simple cross-platform key-value storage ───────────────────────────────────
// Uses localStorage on web, in-memory fallback on native until a storage
// package (e.g. expo-secure-store) is installed.
const memoryStore: Record<string, string> = {};

const storage = {
    get: (key: string): string | null => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage.getItem(key);
            }
        } catch { }
        return memoryStore[key] ?? null;
    },
    set: (key: string, value: string): void => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(key, value);
                return;
            }
        } catch { }
        memoryStore[key] = value;
    },
    remove: (key: string): void => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(key);
                return;
            }
        } catch { }
        delete memoryStore[key];
    },
};

// ── Constants ────────────────────────────────────────────────────────────────
const TOKEN_KEY = 'tguide_token';
const USER_KEY = 'tguide_user';

// ── Types ────────────────────────────────────────────────────────────────────
export type AuthUser = {
    id: string;
    username: string;
    email: string;
    name: string;
    bio: string;
    profileImage: string;
    followers: number;
    following: number;
};

type AuthContextType = {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on app start
    useEffect(() => {
        try {
            const storedToken = storage.get(TOKEN_KEY);
            const storedUser = storage.get(USER_KEY);
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch {
            // ignore
        } finally {
            setIsLoading(false);
        }
    }, []);

    const persist = (tok: string, u: AuthUser) => {
        storage.set(TOKEN_KEY, tok);
        storage.set(USER_KEY, JSON.stringify(u));
        setToken(tok);
        setUser(u);
    };

    const clear = () => {
        storage.remove(TOKEN_KEY);
        storage.remove(USER_KEY);
        setToken(null);
        setUser(null);
    };

    const login = useCallback(async (email: string, password: string) => {
        const data = await authAPI.login(email, password);
        persist(data.token, data.user as AuthUser);
    }, []);

    const signup = useCallback(async (username: string, email: string, password: string) => {
        const data = await authAPI.signup(username, email, password);
        persist(data.token, data.user as AuthUser);
    }, []);

    const logout = useCallback(async () => {
        clear();
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
