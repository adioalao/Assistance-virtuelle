import { CardGroup } from "@/components/back-office/custom/cardGroup";
import { ChartAnsweredQuestionEvolution } from "@/components/back-office/custom/chartAnsweredQuestionEvolution";
import { ChartStatusRepartition } from '@/components/back-office/custom/chartStatusRepartition';

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
