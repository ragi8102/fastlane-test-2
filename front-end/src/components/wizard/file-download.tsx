'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText } from 'lucide-react';
import type { ReactNode } from 'react';

interface FileDownloadProps {
  files: string[];
  label?: string;
  icon?: ReactNode;
}

export function FileDownload({
  files,
  label = 'Download Files',
  icon,
}: FileDownloadProps) {
  const handleDownload = (filename: string) => {
    // In a real app, this would trigger actual file download
    console.log(`Downloading ${filename}`);

    // Mock download - create a blob and trigger download
    const content = `Mock content for ${filename}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (files.length === 0) {
    return null;
  }

  if (files.length === 1) {
    return (
      <Button
        variant="outline"
        onClick={() => handleDownload(files[0])}
        className="gap-2 bg-transparent"
      >
        {icon || <Download className="h-4 w-4" />}
        {label}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          {icon || <Download className="h-4 w-4" />}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {files.map((file) => (
          <DropdownMenuItem key={file} onClick={() => handleDownload(file)}>
            <FileText className="mr-2 h-4 w-4" />
            {file}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
