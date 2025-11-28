/**
 * Training System - Context-aware help and training delivery
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  HelpCircle,
  Play,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Video,
  FileText,
  X,
  Search,
  ThumbsUp,
  Clock,
  Award,
  Target
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import type { 
  Language, 
  TrainingRecord, 
  TrainingType, 
  TrainingStatus,
  ContextualHelp,
  OnboardingStep,
  UserOnboardingProgress,
  ExceptionTrainingTrigger
} from '../../../shared/types/core';

interface TrainingSystemProps {
  currentUserId: string;
  currentScreen: string;
  lang: Language;
}

interface TrainingModule {
  id: TrainingType;
  title: string;
  description: string;
  duration: number; // minutes
  format: 'video' | 'interactive' | 'quiz';
  required: boolean;
  videoUrl?: string;
  quizQuestions?: QuizQuestion[];
  steps?: InteractiveStep[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface InteractiveStep {
  id: string;
  title: string;
  description: string;
  action?: string;
  completed: boolean;
}

// Context-aware Help Button Component
export const ContextualHelpButton: React.FC<{
  screenId: string;
  lang: Language;
}> = ({ screenId, lang }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [helpContent, setHelpContent] = useState<ContextualHelp | null>(null);

  useEffect(() => {
    loadHelpContent(screenId);
  }, [screenId]);

  const loadHelpContent = async (screen: string) => {
    // Mock contextual help content - in real app, fetch from SharePoint
    const helpData: Record<string, ContextualHelp> = {
      'manager_dashboard': {
        screenId: 'manager_dashboard',
        title: 'Understanding Your Tasks',
        quickTips: [
          'Use filter pills to show/hide task types',
          'Red borders indicate overdue tasks',
          'Click flywheel cards to start logging',
          'Swipe to browse all your tasks'
        ],
        videoUrl: 'https://teams.microsoft.com/l/entity/video123',
        pdfUrl: 'https://sharepoint.com/sites/haccp/documents/dashboard-guide.pdf',
        searchable: true
      },
      'sanitizer_log': {
        screenId: 'sanitizer_log',
        title: 'How to Test Sanitizer Solution',
        quickTips: [
          'Use test strips that match your sanitizer type',
          'Dip strip for 10 seconds, compare to color chart',
          'Water temperature must be above 75°F',
          'Log immediately - don\'t wait until end of shift'
        ],
        videoUrl: 'https://teams.microsoft.com/l/entity/video456',
        pdfUrl: 'https://sharepoint.com/sites/haccp/documents/sanitizer-testing.pdf',
        searchable: true
      },
      'corrective_action': {
        screenId: 'corrective_action',
        title: 'What to Do When Temps Fail',
        quickTips: [
          'Check thermometer calibration first',
          'Move food to working unit immediately',
          'Call maintenance if equipment problem',
          'Document all actions taken'
        ],
        videoUrl: 'https://teams.microsoft.com/l/entity/video789',
        pdfUrl: 'https://sharepoint.com/sites/haccp/documents/corrective-actions.pdf',
        searchable: true
      }
    };

    setHelpContent(helpData[screen] || null);
  };

  const handleMarkHelpful = () => {
    // TODO: Track helpful feedback for analytics
    console.log('Help marked as helpful for screen:', screenId);
  };

  if (!helpContent) return null;

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed top-4 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors"
        title="Get Help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Help Panel */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">{helpContent.title}</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Quick Tips */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Quick Tips</h4>
                <ul className="space-y-1">
                  {helpContent.quickTips.map((tip, index) => (
                    <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Video Link */}
              {helpContent.videoUrl && (
                <div className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">Video Tutorial</span>
                  </div>
                  <Button
                    onClick={() => window.open(helpContent.videoUrl, '_blank')}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Play className="w-4 h-4" />
                    Watch Tutorial
                  </Button>
                </div>
              )}

              {/* PDF Job Aid */}
              {helpContent.pdfUrl && (
                <div className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Printable Job Aid</span>
                  </div>
                  <Button
                    onClick={() => window.open(helpContent.pdfUrl, '_blank')}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    Download PDF
                  </Button>
                </div>
              )}

              {/* Feedback */}
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600 mb-2">Was this helpful?</p>
                <Button
                  onClick={handleMarkHelpful}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Yes, this helped
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Exception Training Modal Component
export const ExceptionTrainingModal: React.FC<{
  scenario: 'out_of_range_temp' | 'failed_sanitizer' | 'repeated_errors';
  value?: number;
  limit?: number;
  onComplete: () => void;
  onSkip: () => void;
}> = ({ scenario, value, limit, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [watchedVideo, setWatchedVideo] = useState(false);

  const getScenarioContent = () => {
    switch (scenario) {
      case 'out_of_range_temp':
        return {
          title: 'Temperature Out of Range',
          message: `Temperature reading of ${value}°F exceeds the ${limit}°F limit`,
          videoTitle: 'What to do when cooler fails',
          videoUrl: 'https://teams.microsoft.com/l/entity/temp-failure-90sec',
          steps: [
            'Move all food to a working unit immediately',
            'Check the thermometer calibration',
            'Call maintenance to repair the unit',
            'Monitor food temperatures every 30 minutes'
          ]
        };
      case 'failed_sanitizer':
        return {
          title: 'Sanitizer Test Failed',
          message: `Reading of ${value} ppm is below the ${limit} ppm minimum`,
          videoTitle: 'Correcting sanitizer concentration',
          videoUrl: 'https://teams.microsoft.com/l/entity/sanitizer-fix-60sec',
          steps: [
            'Check sanitizer dispenser settings',
            'Test water temperature (must be 75°F+)',
            'Adjust dispenser or replace sanitizer',
            'Re-test and log new reading'
          ]
        };
      case 'repeated_errors':
        return {
          title: 'Multiple Issues Detected',
          message: 'You\'ve had 3 out-of-range readings this week',
          videoTitle: 'Best practices refresher',
          videoUrl: 'https://teams.microsoft.com/l/entity/best-practices-5min',
          steps: [
            'Review proper logging procedures',
            'Check equipment calibration',
            'Contact your lead if problems persist',
            'Complete additional training modules'
          ]
        };
      default:
        return null;
    }
  };

  const content = getScenarioContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{content.title}</h3>
              <p className="text-slate-600">{content.message}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Video Section */}
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Video className="w-5 h-5 text-red-600" />
                <span className="font-medium">{content.videoTitle}</span>
                <span className="text-sm text-slate-500">(90 seconds)</span>
              </div>
              
              <div className="bg-slate-100 rounded-lg h-32 flex items-center justify-center mb-3">
                <button
                  onClick={() => {
                    setWatchedVideo(true);
                    // Open video in Teams
                    window.open(content.videoUrl, '_blank');
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-colors"
                >
                  <Play className="w-6 h-6" />
                </button>
              </div>
              
              {watchedVideo && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Video watched - ready to proceed
                </div>
              )}
            </div>

            {/* Action Steps */}
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Action Steps:</h4>
              <ol className="space-y-2">
                {content.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-200">
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex-1"
            >
              I Know What To Do
            </Button>
            <Button
              onClick={onComplete}
              variant="primary"
              className="flex-1"
              disabled={!watchedVideo && scenario !== 'repeated_errors'}
            >
              Continue to Log
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Onboarding Tour Component
export const OnboardingTour: React.FC<{
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
}> = ({ userId, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<UserOnboardingProgress>({
    userId,
    onboardingCompleted: false,
    currentStep: 0,
    stepsCompleted: [],
    canReplay: true,
    lastAccessed: new Date().toISOString()
  });

  const onboardingSteps: OnboardingStep[] = [
    {
      stepId: 'welcome',
      title: 'Welcome to Digital Compliance',
      description: 'This quick tour will show you the main features',
      targetElement: '',
      actionRequired: false,
      completed: false,
      order: 1
    },
    {
      stepId: 'filter_pills',
      title: 'Filter Pills',
      description: 'Click these to show/hide different task types',
      targetElement: '.filter-pills',
      actionRequired: true,
      completed: false,
      order: 2
    },
    {
      stepId: 'flywheel',
      title: 'Task Flywheel',
      description: 'Swipe up and down to browse your tasks',
      targetElement: '.flywheel-container',
      actionRequired: true,
      completed: false,
      order: 3
    },
    {
      stepId: 'focused_card',
      title: 'Current Task',
      description: 'This card shows your next priority - tap to start logging',
      targetElement: '.focused-card',
      actionRequired: true,
      completed: false,
      order: 4
    },
    {
      stepId: 'complete',
      title: 'You\'re Ready!',
      description: 'Tap the ? icon anytime for help',
      targetElement: '',
      actionRequired: false,
      completed: false,
      order: 5
    }
  ];

  const currentStepData = onboardingSteps[currentStep];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skipTour = () => {
    // Mark as completed but skipped
    setProgress({
      ...progress,
      onboardingCompleted: true,
      currentStep: onboardingSteps.length
    });
    onSkip();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75">
      {/* Step Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg">
        <span className="text-sm font-medium text-slate-700">
          Step {currentStep + 1} of {onboardingSteps.length}
        </span>
      </div>

      {/* Step Content */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {currentStepData.title}
        </h3>
        <p className="text-slate-600 mb-6">
          {currentStepData.description}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={skipTour}
            className="text-slate-500 hover:text-slate-700 text-sm"
          >
            Skip Tour
          </button>
          
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                size="sm"
              >
                Back
              </Button>
            )}
            <Button
              onClick={nextStep}
              variant="primary"
              size="sm"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 rounded-full h-2 transition-all"
              style={{
                width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Highlight overlay for target elements */}
      {currentStepData.targetElement && (
        <div
          className="absolute border-4 border-blue-500 rounded-lg pointer-events-none"
          style={{
            // Position would be calculated based on target element
            top: '200px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '200px'
          }}
        />
      )}
    </div>
  );
};

// Training Progress Dashboard
export const TrainingDashboard: React.FC<{
  userId: string;
  userRole: string;
  lang: Language;
}> = ({ userId, userRole, lang }) => {
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [availableModules, setAvailableModules] = useState<TrainingModule[]>([]);

  useEffect(() => {
    loadTrainingData();
  }, [userId]);

  const loadTrainingData = () => {
    // Mock training data
    const modules: TrainingModule[] = [
      {
        id: 'haccp_fundamentals',
        title: 'HACCP Fundamentals',
        description: 'Basic food safety principles and hazard analysis',
        duration: 45,
        format: 'video',
        required: true,
        videoUrl: 'https://teams.microsoft.com/l/entity/haccp-fundamentals'
      },
      {
        id: 'temperature_logging',
        title: 'Temperature Logging',
        description: 'How to properly measure and log food temperatures',
        duration: 30,
        format: 'interactive',
        required: true,
        steps: [
          {
            id: 'step1',
            title: 'Choose the right thermometer',
            description: 'Learn about different thermometer types',
            completed: false
          }
        ]
      }
    ];

    setAvailableModules(modules);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Training Dashboard</h1>
        <p className="text-slate-600">Track your progress and complete required modules</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">4</p>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">2</p>
              <p className="text-sm text-slate-600">In Progress</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">1</p>
              <p className="text-sm text-slate-600">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Training Modules */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Training Modules</h2>
        </div>
        
        <div className="divide-y divide-slate-200">
          {availableModules.map((module) => (
            <div key={module.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    module.required ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {module.format === 'video' ? (
                      <Video className={`w-6 h-6 ${
                        module.required ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    ) : (
                      <BookOpen className={`w-6 h-6 ${
                        module.required ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      {module.title}
                      {module.required && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                          Required
                        </span>
                      )}
                    </h3>
                    <p className="text-slate-600 text-sm">{module.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {module.duration} minutes
                      </span>
                      <span className="capitalize">{module.format}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    // Start training module
                    if (module.videoUrl) {
                      window.open(module.videoUrl, '_blank');
                    }
                  }}
                  variant="primary"
                >
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { TrainingSystemProps };