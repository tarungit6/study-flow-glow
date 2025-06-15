
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto">
        <Dashboard />
      </div>
    </Layout>
  );
};

export default Index;
