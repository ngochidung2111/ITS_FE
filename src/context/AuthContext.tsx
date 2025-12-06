import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user:{
    email: string,
    password: string,
    name?: string,
    role?: string
  } | null; 
  loginContext: (userData: any, token: string) => void;
  logoutContext: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Lấy trạng thái ban đầu từ Local Storage
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    // Logic đơn giản: nếu có token, coi như đã đăng nhập
    if (token) {
      // Tùy chọn: Gọi API để lấy thông tin user nếu cần
      // Hiện tại, ta chỉ set isAuthenticated là true
      setIsAuthenticated(true); 
      // Tùy chọn: Lấy thông tin user nếu bạn có lưu nó trong Local Storage
    }
  }, []);

const loginContext = (userData: any, token: string) => {
    localStorage.setItem('userToken', token); // Lưu token
    setUser(userData);
    setIsAuthenticated(true);
};

const logoutContext = () => {
    localStorage.removeItem('userToken'); // Xóa token
    setUser(null);
    setIsAuthenticated(false);
};

return (
    <AuthContext.Provider value={{ isAuthenticated, user, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
