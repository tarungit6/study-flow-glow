
import { Layout } from "@/components/Layout";
import { RecommendationFeed } from "@/components/home/RecommendationFeed";

const Index = () => {
  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-6">
        <RecommendationFeed />
      </div>
    </Layout>
  );
};

export default Index;
