'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { validateContent, Issue, IssueSeverity } from '@/lib/validateContent';

const SEVERITY_ORDER: Record<IssueSeverity, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

export default function ContentStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const issues = useMemo(() => validateContent(), []);

  const counts = useMemo(() => {
    let errors = 0;
    let warnings = 0;
    let info = 0;
    for (const issue of issues) {
      if (issue.severity === 'error') errors++;
      else if (issue.severity === 'warning') warnings++;
      else if (issue.severity === 'info') info++;
    }
    return { errors, warnings, info };
  }, [issues]);

  // Log errors once on load in development
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const errorIssues = issues.filter((i) => i.severity === 'error');
      if (errorIssues.length > 0) {
        console.groupCollapsed(
          `[Content Pipeline] ${errorIssues.length} content errors found`
        );
        for (const err of errorIssues) {
          console.warn(
            `[${err.section}] ${err.id ? `(${err.id}) ` : ''}${err.message}`
          );
        }
        console.groupEnd();
      }
    }
  }, [issues]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Group issues by section and sort within groups
  const groupedIssues = useMemo(() => {
    const groups: Record<string, Issue[]> = {};
    for (const issue of issues) {
      if (!groups[issue.section]) {
        groups[issue.section] = [];
      }
      groups[issue.section].push(issue);
    }

    // Sort sections: Site, Clients, Posts, Case Studies, Hero, Crew, Proof, One Month, others
    const sectionOrder = [
      'Site',
      'Clients',
      'Posts',
      'Case Studies',
      'Hero',
      'Crew',
      'Proof',
      'One Month',
    ];

    const sortedSectionNames = Object.keys(groups).sort((a, b) => {
      const idxA = sectionOrder.indexOf(a);
      const idxB = sectionOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return sortedSectionNames.map((section) => ({
      section,
      issues: groups[section].sort(
        (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
      ),
    }));
  }, [issues]);

  return (
    <>
      {/* Floating Trigger Button: Bottom-Right (above mobile bottom bar, respecting safe area) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Open Content Readiness Status: ${counts.errors} errors, ${counts.warnings} warnings`}
        className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:bottom-4 right-3 sm:right-4 z-50 inline-flex min-h-[44px] items-center gap-2 border border-line-on-dark bg-ink px-3 py-2 text-paper font-mono text-xs font-semibold select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-paper transition-opacity hover:opacity-90 shadow-none"
      >
        <span
          className={`h-2 w-2 rounded-full ${
            counts.errors > 0
              ? 'bg-signal'
              : counts.warnings > 0
                ? 'bg-paper'
                : 'bg-paper/60'
          }`}
          aria-hidden="true"
        />
        <span>
          Content: {counts.errors} errors, {counts.warnings} warnings
        </span>
      </button>

      {/* Slide-over Content Status Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Content Validation Readiness Dossier"
          className="fixed inset-0 z-50 flex justify-end items-stretch"
        >
          {/* Backdrop: Solid ink at 60% opacity (no blur, no gradient) */}
          <div
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-ink/60 transition-opacity"
          />

          {/* Panel Container: Solid paper, hairline border, no shadows */}
          <div className="relative z-10 w-full sm:w-[500px] h-full overflow-y-auto overscroll-contain bg-paper text-ink border-l border-line p-6 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="font-mono text-xs text-ink-soft uppercase tracking-wider block">
                  Quality Audit
                </span>
                <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                  Content Pipeline
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Content Pipeline panel"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-line bg-paper text-ink hover:bg-paper-dark focus-visible:outline-2 focus-visible:outline-ink cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Status Summary Pills */}
            <div className="grid grid-cols-3 gap-2 border-b border-line pb-4">
              <div className="flex flex-col p-2.5 border border-line bg-paper-dark/30">
                <span className="font-mono text-[10px] uppercase text-ink-soft">
                  Errors
                </span>
                <span className="font-display text-2xl font-bold text-ink">
                  {counts.errors}
                </span>
              </div>
              <div className="flex flex-col p-2.5 border border-line bg-paper-dark/30">
                <span className="font-mono text-[10px] uppercase text-ink-soft">
                  Warnings
                </span>
                <span className="font-display text-2xl font-bold text-ink">
                  {counts.warnings}
                </span>
              </div>
              <div className="flex flex-col p-2.5 border border-line bg-paper-dark/30">
                <span className="font-mono text-[10px] uppercase text-ink-soft">
                  Info
                </span>
                <span className="font-display text-2xl font-bold text-ink">
                  {counts.info}
                </span>
              </div>
            </div>

            {/* Issues List Grouped by Section */}
            <div className="flex flex-col gap-6 flex-1">
              {groupedIssues.map(({ section, issues: sectionIssues }) => (
                <div key={section} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-line/60 pb-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                      {section}
                    </span>
                    <span className="font-mono text-[10px] text-ink-soft">
                      {sectionIssues.length}{' '}
                      {sectionIssues.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2">
                    {sectionIssues.map((issue, idx) => (
                      <li
                        key={idx}
                        className={`flex flex-col gap-1 p-3 border text-xs leading-relaxed ${
                          issue.severity === 'error'
                            ? 'border-ink bg-ink text-paper'
                            : issue.severity === 'warning'
                              ? 'border-line bg-paper-dark/40 text-ink'
                              : 'border-line/40 bg-paper text-ink-soft'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${
                              issue.severity === 'error'
                                ? 'bg-signal text-ink'
                                : issue.severity === 'warning'
                                  ? 'bg-ink text-paper'
                                  : 'bg-paper-dark text-ink-soft'
                            }`}
                          >
                            {issue.severity === 'error' ? (
                              <AlertCircle className="h-3 w-3" aria-hidden="true" />
                            ) : issue.severity === 'warning' ? (
                              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                            ) : (
                              <Info className="h-3 w-3" aria-hidden="true" />
                            )}
                            <span>{issue.severity}</span>
                          </span>

                          {issue.id && (
                            <span className="font-mono text-[10px] text-inherit opacity-75">
                              {issue.id}
                            </span>
                          )}
                        </div>

                        <p className="font-body text-xs mt-0.5">
                          {issue.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Launch Instruction Footer */}
            <div className="border-t border-line pt-4 text-xs font-mono text-ink-soft">
              <p>
                Set <code className="text-ink font-bold">SHOW_CONTENT_STATUS = false</code> in <code className="text-ink">src/data/site.ts</code> before launch.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
