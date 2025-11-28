/**
 * Corrective Action Flow for out-of-range readings
 */

import React, { useState } from 'react';
import { AlertTriangle, Soup } from 'lucide-react';
import type { CorrectiveActionFlowProps } from '../types';
import { 
  TRANSLATIONS, 
  getCorrectiveActionTranslation 
} from '../../../localization/translations';
import { CORRECTIVE_ACTIONS } from '../constants';

export const CorrectiveActionFlow: React.FC<CorrectiveActionFlowProps> = ({
  task,
  value,
  onAction,
  onCancel,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedAction, setSelectedAction] = useState('');
  const [customNote, setCustomNote] = useState('');
  
  const isWarming = task.type === 'warming';
  const correctiveActionsRaw = CORRECTIVE_ACTIONS[task.type] || [];

  const handleSubmit = () => {
    if (!selectedAction) return;
    
    if (selectedAction === "Other (add note)") {
      if (!customNote.trim()) return;
      onAction(selectedAction, customNote);
    } else {
      onAction(selectedAction);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col h-full animate-in slide-in-from-right">
      <div className="flex-1 p-6 flex flex-col">
        {/* Alert Header */}
        <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-100 mb-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {isWarming ? <Soup size={32} /> : <AlertTriangle size={32} />}
          </div>
          <h3 className="text-red-900 font-bold text-2xl mb-1">
            {isWarming ? t.cabinetNotReady : t.outOfRangeTitle}
          </h3>
          <p className="text-red-700">
            {isWarming 
              ? t.cabinetNotReadyMsg 
              : `${t.outOfRangeMsg} (${task.range?.min}-${task.range?.max}${task.range?.unit}).`}
          </p>
        </div>

        {/* Action Selection */}
        <h4 className="font-bold text-slate-700 mb-4 px-2">{t.selectCorrectiveAction}</h4>
        
        <div className="flex flex-col gap-3 flex-1">
          {correctiveActionsRaw.map((action) => {
            const displayAction = getCorrectiveActionTranslation(action, lang);
            return (
              <button
                key={action}
                onClick={() => setSelectedAction(action)}
                className={`p-4 rounded-xl text-left border-2 font-medium transition-all ${
                    selectedAction === action 
                    ? 'border-slate-800 bg-slate-800 text-white shadow-lg' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {displayAction}
              </button>
            );
          })}
        </div>

        {/* Custom Note Input */}
        {selectedAction === "Other (add note)" && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
              {t.describeAction}
            </label>
            <textarea 
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-slate-800 outline-none text-slate-700 font-medium"
              rows={3}
              placeholder={t.typeDetails}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-6 flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 rounded-xl"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedAction || (selectedAction === "Other (add note)" && !customNote.trim())}
            className="flex-2 bg-red-600 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-xl disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all"
          >
            {t.recordAction}
          </button>
        </div>
      </div>
    </div>
  );
};