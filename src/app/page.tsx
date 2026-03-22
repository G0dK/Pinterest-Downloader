'use client';

import { useState, useRef } from 'react';
import { FolderOpen, Download, CheckCircle2, XCircle, Loader2, Image as ImageIcon } from 'lucide-react';

type DownloadStatus = 'idle' | 'parsing' | 'downloading' | 'success' | 'error';

interface Task {
  id: string;
  originalUrl: string;
  status: DownloadStatus;
  message?: string;
  filename?: string;
}

export default function Home() {
  const [urls, setUrls] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [directoryHandle, setDirectoryHandle] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectFolder = async () => {
    try {
      if (!('showDirectoryPicker' in window)) {
        setErrorMsg('Your browser does not support the File System Access API. Please use Chrome or Edge.');
        return;
      }
      // @ts-ignore
      const handle = await window.showDirectoryPicker();
      setDirectoryHandle(handle);
      setErrorMsg('');
    } catch (error) {
      console.error(error);
      setErrorMsg('Folder selection was cancelled or failed.');
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const startDownload = async () => {
    if (!directoryHandle) {
      setErrorMsg('Please select an output folder first.');
      return;
    }

    const urlList = urls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    if (urlList.length === 0) {
      setErrorMsg('Please enter at least one URL.');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    const initialTasks: Task[] = urlList.map((url, index) => ({
      id: `${Date.now()}-${index}`,
      originalUrl: url,
      status: 'idle'
    }));

    setTasks(initialTasks);

    for (let i = 0; i < initialTasks.length; i++) {
      const task = initialTasks[i];
      
      // Update status to parsing
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'parsing' } : t));

      try {
        // Step 1: Parse the Pinterest URL
        const parseRes = await fetch(`/api/parse?url=${encodeURIComponent(task.originalUrl)}`);
        if (!parseRes.ok) {
          throw new Error('Failed to parse URL');
        }
        
        const parseData = await parseRes.json();
        if (!parseData.imageUrl) {
          throw new Error('Could not find high-res image');
        }

        // Update status to downloading
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'downloading' } : t));

        // Step 2: Fetch the proxy image
        const proxyRes = await fetch(`/api/proxy?url=${encodeURIComponent(parseData.imageUrl)}`);
        if (!proxyRes.ok) {
          throw new Error('Failed to download image');
        }

        const blob = await proxyRes.blob();

        // Extract a sensible filename from the image URL or use timestamp
        const urlParts = parseData.imageUrl.split('/');
        const originalFilename = urlParts[urlParts.length - 1];
        const filename = originalFilename.includes('.') ? originalFilename : `pinterest-${Date.now()}.jpg`;

        // Step 3: Save to local directory
        const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();

        // Update status to success
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'success', filename } : t));

      } catch (error: any) {
        // Update status to error
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'error', message: error.message } : t));
      }

      // Add a slight delay to avoid rate limiting
      if (i < initialTasks.length - 1) {
        await delay(500);
      }
    }

    setIsProcessing(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 pt-12">
          <h1 className="text-4xl font-light tracking-tight">Pinterest Downloader</h1>
          <p className="text-gray-500">Batch download high-definition images elegantly.</p>
        </div>

        {/* Main Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-6">
            
            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                {errorMsg}
              </div>
            )}

            {/* Input Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Pinterest URLs (one per line)</label>
              <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="https://www.pinterest.com/pin/123456789/&#10;https://i.pinimg.com/originals/..."
                className="w-full h-48 p-4 bg-gray-50 border-transparent rounded-xl focus:border-gray-200 focus:bg-white focus:ring-0 transition-all resize-none text-sm font-mono leading-relaxed"
                disabled={isProcessing}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
              <button
                onClick={handleSelectFolder}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                disabled={isProcessing}
              >
                <FolderOpen className="w-4 h-4 text-gray-500" />
                {directoryHandle ? directoryHandle.name : 'Select Output Folder'}
              </button>

              <button
                onClick={startDownload}
                disabled={isProcessing || !directoryHandle || !urls.trim()}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gray-900 hover:bg-black text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Task List */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                Download Progress
              </h2>
            </div>
            <ul className="divide-y divide-gray-50">
              {tasks.map((task) => (
                <li key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex-1 truncate pr-4">
                    <p className="text-sm font-medium truncate" title={task.originalUrl}>
                      {task.originalUrl}
                    </p>
                    {task.filename && (
                      <p className="text-xs text-gray-500 mt-1">Saved as: {task.filename}</p>
                    )}
                    {task.message && (
                      <p className="text-xs text-red-500 mt-1">{task.message}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 w-32 justify-end">
                    {task.status === 'idle' && <span className="text-xs text-gray-400 font-medium">Pending</span>}
                    {task.status === 'parsing' && (
                      <>
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                        <span className="text-xs text-blue-500 font-medium">Parsing...</span>
                      </>
                    )}
                    {task.status === 'downloading' && (
                      <>
                        <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                        <span className="text-xs text-purple-500 font-medium">Downloading...</span>
                      </>
                    )}
                    {task.status === 'success' && (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Success</span>
                      </>
                    )}
                    {task.status === 'error' && (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-xs text-red-600 font-medium">Failed</span>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </main>
  );
}
