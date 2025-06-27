'use client';

import { Card, CardContent, CardFooter } from '@/components/backoffice/ui/card';
import { CalendarCheck, MessageSquare, MessageSquareX } from 'lucide-react';
import { ReactNode, ElementType } from "react";

type CardAnsweredQuestionsProps = {
    icon: ElementType;
    quantity: number;
    children: ReactNode;
    iconClassName?: string;
}

function CardAnsweredQuestions({
    icon: Icon,
    quantity,
    children,
    iconClassName = 'w-8 h-8 text-green-600 dark:text-green-300',
}: CardAnsweredQuestionsProps) {
    return (
        <Card className="hover:scale-103">
            <CardContent className="flex text-xl">
                <span className="inline-block dark:bg-green-900 pl-2 pr-4 rounded-xl align-top">
                    <Icon className={iconClassName} />
                </span>
                <span className="inline-block align-middle">{children}</span>
            </CardContent>
            <CardFooter className="text-3xl font-extrabold">{quantity}</CardFooter>
        </Card>
    );
}

export const CardGroup = () => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pb-2">
                <CardAnsweredQuestions
                    icon={MessageSquare}
                    quantity={1250}
                    iconClassName="w-10 h-10 text-green-500 dark:text-blue-300"
                >
                    Total de questions
                </CardAnsweredQuestions>
                <CardAnsweredQuestions
                    icon={MessageSquareX}
                    quantity={126}
                    iconClassName="w-10 h-10 text-red-500 dark:text-blue-300"
                >
                    Questions traitées
                </CardAnsweredQuestions>
                <CardAnsweredQuestions
                    icon={CalendarCheck}
                    quantity={12}
                    iconClassName="w-10 h-10 text-blue-500 dark:text-blue-300"
                >
                    Nombre total d'utilisateurs
                </CardAnsweredQuestions>
                <CardAnsweredQuestions
                    icon={CalendarCheck}
                    quantity={12}
                    iconClassName="w-10 h-10 text-blue-500 dark:text-blue-300"
                >
                    Questions posées aujourd&apos;hui
                </CardAnsweredQuestions>
            </div>
        </>
    );
};
