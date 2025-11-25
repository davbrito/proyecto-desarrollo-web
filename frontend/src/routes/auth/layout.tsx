import "@/styles/auth.css";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="h-svh content-center overflow-auto">
      <Outlet />
    </div>
  );
}
