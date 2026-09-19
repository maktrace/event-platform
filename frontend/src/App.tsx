import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/layout/Header";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50">
          <Header />

          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;