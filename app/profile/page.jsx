import ProtectedRoute from "../../src/components/ProtectedRoute";
import UserProfile from "../../src/components/UserProfile";

export default function Page() {
  return (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  );
}
