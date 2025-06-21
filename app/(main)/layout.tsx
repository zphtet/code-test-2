import Navbar from "@/components/header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-7xl mx-auto px-5">
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
