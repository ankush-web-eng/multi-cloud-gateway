'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, AlertCircle } from 'lucide-react';
import { JOBS } from '@/helpers/jobs';
import { JobLog } from '@/types/JobLog';
import { StatusBadge } from '@/components/cards/Status-Badge';

export default function JobLogsDashboard() {
    const [jobLogs, setJobLogs] = useState<JobLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedJob, setExpandedJob] = useState<string | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const fetchJobLogs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs`);
            if (!response.ok) {
                throw new Error('Failed to fetch job logs');
            }
            const data = await response.json();
            console.log(data);
            setJobLogs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setJobLogs(JOBS);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobLogs();
    }, []);

    const toggleJobDetails = (jobId: string) => {
        if (expandedJob === jobId) {
            setExpandedJob(null);
        } else {
            setExpandedJob(jobId);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Job Logs Dashboard</h1>
                <button
                    onClick={fetchJobLogs}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    <RefreshCw size={16} className="mr-2" />
                    Refresh
                </button>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
                </div>
            )}

            {error && !isLoading && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!isLoading && jobLogs.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job ID
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobLogs.map((job, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {job.jobId}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                        {job.service}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <StatusBadge status={job.status} />
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                        {formatDate(job.createdAt)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                        <button
                                            onClick={() => toggleJobDetails(job.jobId)}
                                            className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end w-full"
                                        >
                                            <span>Details</span>
                                            <ChevronDown
                                                size={16}
                                                className={`ml-1 transition-transform duration-200 ${expandedJob === job.jobId ? 'transform rotate-180' : ''}`}
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!isLoading && jobLogs.length === 0 && (
                <div className="py-12 text-center">
                    <p className="text-gray-500">No job logs available</p>
                </div>
            )}

            {expandedJob && jobLogs.find(job => job.jobId === expandedJob) && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 animate-fadeIn">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Job Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Payload</h4>
                            <pre className="mt-1 bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                                {JSON.stringify(jobLogs.find(job => job.jobId === expandedJob)?.payload, null, 2)}
                            </pre>
                        </div>
                        {jobLogs.find(job => job.jobId === expandedJob)?.response && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Response</h4>
                                <pre className="mt-1 bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                                    {JSON.stringify(jobLogs.find(job => job.jobId === expandedJob)?.response, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-6 text-right text-xs text-gray-500">
                <p>Total Jobs: {jobLogs.length}</p>
            </div>
        </div>
    );
}
