import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthProvider';
import { PermissionsProvider } from './features/auth/PermissionsProvider';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <PermissionsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PermissionsProvider>
    </AuthProvider>
  );
}
