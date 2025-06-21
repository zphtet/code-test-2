import AuthProvider from "@/components/providers/auth-provider";
import { PropsWithChildren } from "react";

const Template: React.FC<PropsWithChildren> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Template;
