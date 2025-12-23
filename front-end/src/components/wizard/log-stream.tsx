'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Terminal, Circle } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface LogStreamProps {
  logs: string[];
  isActive?: boolean;
  title?: string;
}

export function LogStream({
  logs,
  isActive = false,
  title = 'Activity Log',
}: LogStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            {title}
          </span>
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Running' : 'Idle'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          className="h-64 w-full rounded border bg-muted/50"
          ref={scrollRef}
        >
          <div className="p-4 space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm font-mono"
              >
                <Circle className="h-2 w-2 mt-2 flex-shrink-0 text-primary" />
                <span className="text-foreground">{log}</span>
              </div>
            ))}
            {isActive && (
              <div className="flex items-center gap-2 text-sm font-mono">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                <span className="text-muted-foreground">Processing...</span>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
