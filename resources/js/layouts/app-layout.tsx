import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Head title="Medical AI Chatbot">
            <link rel="icon" href="/logo.svg" />
            <meta name="description" content="Medical AI Chatbot" />
            <meta name="author" content="Medical AI Chatbot" />
            <meta name="keywords" content="Medical AI Chatbot" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        {children}
    </AppLayoutTemplate>
);
