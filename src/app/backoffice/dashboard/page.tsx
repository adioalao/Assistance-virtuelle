import { CardGroup } from "@/components/custom/backoffice/cardGroup";
import { ChartAnsweredQuestionEvolution } from "@/components/custom/backoffice/chartAnsweredQuestionEvolution";
import { ChartStatusRepartition } from '@/components/custom/backoffice/chartStatusRepartition';

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
