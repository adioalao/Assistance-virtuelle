import { CardGroup } from "@/components/custom/cardGroup";
import { ChartAnsweredQuestionEvolution } from "@/components/custom/chartAnsweredQuestionEvolution";

import { ChartStatusRepartition } from '@/components/custom/chartStatusRepartition';
/*
import RecentQuestions from '@/components/custom/recentActivity/recentQuestions';
  */
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
