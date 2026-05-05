import { ThemeProvider } from "./components/theme-provider";
import { ToastProvider } from "./components/ui/toast";
import { AdminLayout } from "./layouts/AdminLayout";
import { useAuthStore } from "./store/useAuthStore";
import { Login } from "./views/Login";
import { FieldLedger } from "./views/FieldLedger";

function App() {
  const { isAuthenticated, logout } = useAuthStore();
  
  const renderView = () => {
    if (!isAuthenticated) {
      return <Login />;
    }

    // Switch statement for routing as requested
    const view = "ledger"; 
    switch (view) {
      case "ledger":
        return <FieldLedger />;
      default:
        return <FieldLedger />;
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="schema-architect-theme">
      <ToastProvider>
        <AdminLayout onLogout={isAuthenticated ? logout : undefined}>
          {renderView()}
        </AdminLayout>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
