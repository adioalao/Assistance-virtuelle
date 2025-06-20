import { CardGroup } from "@/components/backoffice/custom/cardGroup";
import { ChartAnsweredQuestionEvolution } from "@/components/backoffice/custom/chartAnsweredQuestionEvolution";
import { ChartStatusRepartition } from '@/components/backoffice/custom/chartStatusRepartition';

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
