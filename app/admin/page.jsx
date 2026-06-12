import ProtectedRoute from "../../src/components/ProtectedRoute";
import AdminDashboard from "../../src/components/AdminDashboard";

export default function Page() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
