/**
 * Main logging screen for task completion
 */

import React, { useState } from 'react';
import {
  Check,
  AlertTriangle,
  X,
  ScanLine,
  Sparkles,
  Copy,
  Snowflake,
  Flame,
  Soup
} from 'lucide-react';
import type { LoggingScreenProps, LoggingState } from '../types';
import { 
  TRANSLATIONS, 
  TASK_TITLES, 
  getLocationTranslation, 
  getCorrectiveActionTranslation 
} from '../../../localization/translations';
import { TEMPERATURE_RANGES, CORRECTIVE_ACTIONS, TIMING } from '../constants';
import { CorrectiveActionFlow } from './CorrectiveActionFlow';

export const LoggingScreen: React.FC<LoggingScreenProps> = ({ 
  task, 
  onClose, 
  onComplete, 
  lang 
}) => {
  const t = TRANSLATIONS[lang];
  
  const [state, setState] = useState<LoggingState>({
    step: 'input',
    manualValue: '',
    animationState: 'idle',
    correctiveAction: '',
    customNote: '',
    selectedUnit: task.units?.[0] || '',
    unitValues: {},
    calMethod: 'ice'
  });

  const title = TASK_TITLES[task.title]?.[lang] || task.title;
  const location = getLocationTranslation(task.location, lang);
  const unitName = getLocationTranslation(state.selectedUnit, lang);
  const specificLastLog = task.lastLogs?.[state.selectedUnit] || task.lastLog;

  // Determine validation range
  const getValidationRange = () => {
    let min = task.range?.min || 0;
    let max = task.range?.max || 1000;
    
    if (task.type === 'calibration') {
      if (state.calMethod === 'ice') {
        min = TEMPERATURE_RANGES.calibration_ice.min;
        max = TEMPERATURE_RANGES.calibration_ice.max;
      } else {
        min = TEMPERATURE_RANGES.calibration_boil.min;
        max = TEMPERATURE_RANGES.calibration_boil.max;
      }
    }
    
    return { min, max };
  };

  const { min, max } = getValidationRange();
  
  // Validation logic
  const currentVal = parseFloat(state.manualValue) || min;
  const percentage = Math.min(Math.max(((currentVal - (min * 0.5)) / ((max * 1.5) - (min * 0.5))) * 100, 0), 100);
  const isOutOfRange = (parseFloat(state.manualValue) < min || parseFloat(state.manualValue) > max) && state.manualValue !== '';
  const isSafe = !isOutOfRange && state.manualValue !== '';
  const isWarming = task.type === 'warming';

  // Unit navigation helpers
  const unitIndex = task.units ? task.units.indexOf(state.selectedUnit) : -1;
  const showCopyButton = unitIndex > 0;
  const previousUnitName = showCopyButton ? task.units![unitIndex - 1] : '';
  const previousUnitValue = showCopyButton ? state.unitValues[previousUnitName] : '';

  // Event handlers
  const handleMagicFill = () => {
    if (task.units && state.selectedUnit && task.lastLogs && task.lastLogs[state.selectedUnit]) {
      const lastValStr = task.lastLogs[state.selectedUnit].value;
      const num = lastValStr.replace(/[^0-9.-]/g, '');
      if (num) {
        setState(prev => ({ ...prev, manualValue: num, animationState: 'idle' }));
        return;
      }
    }
    
    // Fallback based on type
    let defaultValue = '38';
    if (task.type === 'calibration') {
      defaultValue = state.calMethod === 'ice' ? '32' : '212';
    } else if (task.type === 'warming') {
      defaultValue = '145';
    } else if (task.type === 'chemical') {
      defaultValue = '350';
    }
    
    setState(prev => ({ ...prev, manualValue: defaultValue, animationState: 'idle' }));
  };

  const handleUnitSelect = (unit: string) => {
    setState(prev => ({
      ...prev,
      selectedUnit: unit,
      manualValue: prev.unitValues[unit] || '',
      step: 'input',
      animationState: 'idle'
    }));
  };
  
  const copyPreviousValue = () => {
    if (!task.units || unitIndex <= 0) return;
    const prevVal = state.unitValues[previousUnitName];
    if (prevVal) {
      setState(prev => ({ ...prev, manualValue: prevVal }));
    }
  };

  const handleLogSubmit = () => {
    const val = state.manualValue;
    const valueNum = parseFloat(val);

    if (!val || isNaN(valueNum)) return;

    if (valueNum >= min && valueNum <= max) {
      setState(prev => ({ ...prev, animationState: 'success' }));
      
      const newUnitValues = { ...state.unitValues, [state.selectedUnit]: val };

      setTimeout(() => {
        if (task.units) {
          const currentIndex = task.units.indexOf(state.selectedUnit);
          if (currentIndex < task.units.length - 1) {
            const nextUnit = task.units[currentIndex + 1];
            setState(prev => ({
              ...prev,
              selectedUnit: nextUnit,
              manualValue: '',
              animationState: 'idle',
              unitValues: newUnitValues
            }));
            return;
          } else {
             onComplete(task.id, `${Object.keys(newUnitValues).length} Units OK`);
             return;
          }
        }

        onComplete(task.id, `${val}${task.range?.unit || ''}`);
      }, TIMING.success_display);
    } else {
      setState(prev => ({ ...prev, animationState: 'error' }));
      setTimeout(() => setState(prev => ({ ...prev, step: 'corrective' })), TIMING.error_display);
    }
  };

  const handleCorrectiveAction = (action: string, note?: string) => {
    const finalNote = action === "Other (add note)" ? note : action;
    onComplete(task.id, `Corrected: ${finalNote}`);
  };

  // Success animation screen
  if (state.animationState === 'success') {
    return (
      <div className="fixed inset-0 z-50 bg-green-500 flex flex-col items-center justify-center text-white animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-full p-8 mb-6 shadow-2xl animate-bounce">
          <Check size={64} className="text-green-600" strokeWidth={4} />
        </div>
        <h2 className="text-4xl font-bold mb-2">{t.success}</h2>
        <p className="text-green-100 text-xl">
            {task.units && unitIndex < task.units.length - 1 
                ? `${t.saved} ${unitName}` 
                : t.logVerified}
        </p>
        {task.units && unitIndex < task.units.length - 1 && (
            <p className="mt-4 text-green-50 font-semibold animate-pulse">{t.loadingNext}</p>
        )}
      </div>
    );
  }

  // Corrective action flow
  if (state.step === 'corrective') {
    return (
      <CorrectiveActionFlow
        task={task}
        value={state.manualValue}
        onAction={handleCorrectiveAction}
        onCancel={() => setState(prev => ({ ...prev, step: 'input', animationState: 'idle' }))}
        lang={lang}
      />
    );
  }

  // Main input screen
  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col h-full animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm flex items-center justify-between shrink-0">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-500">{location}</p>
        </div>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Range Display */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.requiredRange}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.lastReading}</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-slate-800">
              {min} - {max} <span className="text-base font-normal text-slate-400">{task.range?.unit}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-slate-600">{specificLastLog?.value || '--'}</div>
              <div className="text-xs text-slate-400">{specificLastLog?.time || 'Never'}</div>
            </div>
          </div>
        </div>

        {/* Calibration Method Selection */}
        {task.type === 'calibration' && (
          <div className="flex gap-4 mb-2">
            <button 
              onClick={() => setState(prev => ({ ...prev, calMethod: 'ice' }))}
              className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${
                  state.calMethod === 'ice' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' 
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <Snowflake size={24} />
              <span className="text-xs font-bold">{t.icePoint}</span>
            </button>
            <button 
              onClick={() => setState(prev => ({ ...prev, calMethod: 'boil' }))}
              className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${
                  state.calMethod === 'boil' 
                  ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-md' 
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <Flame size={24} />
              <span className="text-xs font-bold">{t.boilPoint}</span>
            </button>
          </div>
        )}

        {/* Warming Cabinet Alert */}
        {task.type === 'warming' && (
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center justify-center gap-4 text-orange-800 font-bold">
            <Soup size={24} />
            <span>{t.warmingCriticalLimit}</span>
          </div>
        )}

        {/* Scan Button for non-calibration tasks */}
        {task.type !== 'warming' && task.type !== 'calibration' && (
          <button 
            onClick={handleMagicFill}
            className="bg-slate-900 text-white rounded-2xl py-8 flex flex-col items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
          >
            <ScanLine size={48} className="opacity-80" />
            <span className="font-bold tracking-widest text-sm opacity-90">
                {task.type === 'temp' ? t.readThermometer : t.scanTestStrip}
            </span>
          </button>
        )}

        <div className="mt-auto">
          {/* Unit Selection */}
          {task.units && (
            <div className="mb-4">
              {task.type === 'calibration' && <div className="text-xs font-bold text-slate-400 mb-2 uppercase">{t.thermometer}</div>}
              <div className="flex gap-2 overflow-x-auto pb-2">
                  {task.units.map((unit: string) => {
                      const isDone = state.unitValues[unit];
                      const isCurrent = unit === state.selectedUnit;
                      const translatedUnit = getLocationTranslation(unit, lang);
                      return (
                          <button
                              key={unit}
                              onClick={() => handleUnitSelect(unit)}
                              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors flex items-center gap-2 ${
                                  isCurrent 
                                      ? 'bg-slate-800 text-white shadow-md' 
                                      : isDone 
                                          ? 'bg-green-100 text-green-800 border border-green-200'
                                          : 'bg-white border border-slate-200 text-slate-500'
                              }`}
                          >
                              {isDone && <Check size={14} />}
                              {translatedUnit}
                          </button>
                      );
                  })}
              </div>
            </div>
          )}

          {/* Manual Entry Section */}
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-500 uppercase">{t.manualEntry}</label>
            
            <div className="flex gap-2">
              {showCopyButton && previousUnitValue && (
                <button 
                  onClick={copyPreviousValue}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg active:bg-blue-100 transition-colors"
                >
                  <Copy size={12} />
                  {t.copy} {previousUnitName.split(' ').pop()} ({previousUnitValue})
                </button>
              )}
              
              <button 
                onClick={handleMagicFill}
                className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg"
              >
                <Sparkles size={12} />
                {t.aiPreFill}
              </button>
            </div>
          </div>

          {/* Value Input */}
          <div className="relative mb-6">
            <input
              type="number"
              pattern="[0-9]*"
              value={state.manualValue}
              onChange={(e) => setState(prev => ({ 
                ...prev, 
                manualValue: e.target.value, 
                animationState: 'idle' 
              }))}
              placeholder="000"
              className={`w-full text-5xl font-bold text-center py-6 rounded-2xl border-2 outline-none transition-all ${
                state.animationState === 'error' || (isWarming && !isSafe)
                  ? 'border-red-300 bg-red-50 text-red-800 placeholder-red-200' 
                  : isSafe 
                    ? 'border-green-300 bg-green-50 text-green-900'
                    : 'border-slate-200 bg-white text-slate-800 focus:border-slate-400'
              }`}
            />
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">
              {task.range?.unit}
            </span>
            
            {/* Validation Display */}
            <div className="mt-4 px-2">
               {isWarming && !isSafe ? (
                 <div className="text-center animate-in fade-in slide-in-from-top-2">
                   <div className="text-red-600 font-black text-sm tracking-widest uppercase mb-1">{t.cabinetNotReady}</div>
                   <div className="text-xs text-red-400 font-medium">{t.cabinetNotReadyMsg}</div>
                 </div>
               ) : (
                 <>
                    <div className="relative h-3 bg-slate-200 rounded-full w-full overflow-hidden">
                        <div 
                          className="absolute top-0 bottom-0 bg-green-400 opacity-30" 
                          style={{
                              left: `${((min - (min*0.5)) / ((max*1.5) - (min*0.5))) * 100}%`,
                              width: `${((max - min) / ((max*1.5) - (min*0.5))) * 100}%`
                          }} 
                        />
                        
                        {state.manualValue && (
                          <div 
                              className={`absolute top-0 bottom-0 w-1.5 transition-all duration-300 ${isSafe ? 'bg-green-600' : 'bg-red-500'}`}
                              style={{ left: `${percentage}%` }}
                          />
                        )}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium font-mono">
                        <span>{Math.floor(min * 0.5)}</span>
                        <span className="text-green-600">{min} (MIN)</span>
                        <span className="text-green-600">{max} (MAX)</span>
                        <span>{Math.floor(max * 1.5)}</span>
                    </div>
                    
                    <div className={`text-center mt-2 text-xs font-bold tracking-widest ${isSafe ? 'text-green-600' : isOutOfRange ? 'text-red-500' : 'text-slate-300'}`}>
                        {isSafe ? (isWarming ? t.readyForUse : t.withinRange) : isOutOfRange ? t.outOfRange : t.enterValue}
                    </div>
                 </>
               )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogSubmit}
            disabled={!state.manualValue}
            className={`w-full text-xl font-bold py-5 rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all ${
              isWarming && !isSafe 
                ? 'bg-red-500 text-white shadow-red-200' 
                : 'bg-slate-900 text-white'
            }`}
          >
            {isWarming && !isSafe ? t.logIssue : t.submit} {task.units && state.selectedUnit ? `- ${unitName}` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};