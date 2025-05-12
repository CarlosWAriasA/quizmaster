import { ReactNode } from "react";
import Footer from "./Footer";

interface PrivateLayoutProps {
  children: ReactNode;
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;
