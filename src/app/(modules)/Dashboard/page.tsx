import { CardGroup } from "@/components/custom/cardGroup";
import { ChartAnsweredQuestionEvolution } from "@/components/custom/chartAnsweredQuestionEvolution";
import { ChartStatusRepartition } from '@/components/custom/chartStatusRepartition';

export default function Dashboard() {
  return (
    <div>
      <div>
        <CardGroup />
        <ChartAnsweredQuestionEvolution />
        <ChartStatusRepartition />
        {/* 
        <RecentQuestions /> */}
      </div>
    </div>
  );
}
