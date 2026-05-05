import { useAuthStore } from "./store/useAuthStore";
import { LoginForm } from "./components/LoginForm";
import { AdminLayout } from "./layouts/AdminLayout";
import { FieldLedger } from "./views/FieldLedger";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? (
    <AdminLayout>
      <FieldLedger />
    </AdminLayout>
  ) : (
    <LoginForm />
  );
};

export default App;
