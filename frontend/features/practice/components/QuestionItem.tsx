'use client';

import { Check } from 'lucide-react';
import { TestQuestion } from '@/types/test';

interface QuestionItemProps {
  question: TestQuestion;
  value: string;
  onChange: (questionId: string, answer: string) => void;
}

function extractOptionKey(option: string): string {
  const match = option.match(/^([A-Za-z0-9]+)\.\s/);
  return match ? match[1] : option;
}

function SingleChoiceInput({ question, value, onChange }: QuestionItemProps) {
  const options = question.options ?? [];

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-800 leading-relaxed">
        {question.prompt}
      </p>
      <div className="space-y-2">
        {options.map((option) => {
          const optionValue =
            question.type === 'multiple_choice'
              ? extractOptionKey(option)
              : option;
          const isSelected = value === optionValue;

          return (
            <label
              key={option}
              onClick={() => onChange(question.id, optionValue)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm cursor-pointer transition-all select-none ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950 font-semibold'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60 text-gray-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-emerald-600' : 'border-gray-400'
                }`}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </span>
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function MultiSelectInput({ question, value, onChange }: QuestionItemProps) {
  const options = question.options ?? [];
  const selectedSet = new Set(
    value ? value.split(',').map((s) => s.trim()).filter(Boolean) : []
  );

  const toggleOption = (optionKey: string) => {
    const next = new Set(selectedSet);
    if (next.has(optionKey)) {
      next.delete(optionKey);
    } else {
      next.add(optionKey);
    }
    const serialized = Array.from(next).sort().join(',');
    onChange(question.id, serialized);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-800 leading-relaxed">
        {question.prompt}
      </p>
      <div className="space-y-2">
        {options.map((option) => {
          const optionKey = extractOptionKey(option);
          const isChecked = selectedSet.has(optionKey);

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(optionKey)}
              className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm cursor-pointer transition-all ${
                isChecked
                  ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950 font-semibold'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60 text-gray-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  isChecked
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-gray-400 bg-white'
                }`}
              >
                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InlineGapInput({ question, value, onChange }: QuestionItemProps) {
  const hasBlankPlaceholder = question.prompt.includes('_____');

  if (!hasBlankPlaceholder) {
    return (
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-gray-800 leading-relaxed">
          {question.prompt}
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(question.id, e.target.value)}
          placeholder="Type your answer..."
          className="w-full max-w-xs bg-white border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
        />
      </div>
    );
  }

  const parts = question.prompt.split('_____');

  return (
    <p className="text-sm font-medium text-gray-800 leading-loose">
      {parts.map((segment, index) => (
        <span key={index}>
          {segment}
          {index < parts.length - 1 && (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(question.id, e.target.value)}
              placeholder={`(${question.number})`}
              aria-label={`Answer for question ${question.number}`}
              className="inline-block mx-1.5 w-32 sm:w-36 px-2.5 py-0.5 text-center bg-emerald-50/40 border-b-2 border-emerald-500 focus:border-emerald-700 focus:bg-white rounded-t-md text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none transition-colors"
            />
          )}
        </span>
      ))}
    </p>
  );
}

function MatchingSelectInput({ question, value, onChange }: QuestionItemProps) {
  const options = question.options ?? [];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p className="text-sm font-medium text-gray-800 leading-relaxed flex-1">
        {question.prompt}
      </p>

      <select
        value={value}
        onChange={(e) => onChange(question.id, e.target.value)}
        className="w-full sm:w-44 bg-white border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none cursor-pointer shrink-0"
      >
        <option value="">Select...</option>
        {options.map((option) => {
          const optionKey = extractOptionKey(option);
          return (
            <option key={option} value={optionKey}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default function QuestionItem({
  question,
  value,
  onChange,
}: QuestionItemProps) {
  const isAnswered = value.trim().length > 0;

  const renderControl = () => {
    switch (question.type) {
      case 'true_false_not_given':
      case 'yes_no_not_given':
      case 'multiple_choice':
        return (
          <SingleChoiceInput
            question={question}
            value={value}
            onChange={onChange}
          />
        );

      case 'multiple_choice_many':
        return (
          <MultiSelectInput
            question={question}
            value={value}
            onChange={onChange}
          />
        );

      case 'gap_filling':
      case 'sentence_completion':
      case 'summary_completion':
        return (
          <InlineGapInput
            question={question}
            value={value}
            onChange={onChange}
          />
        );

      case 'matching_information':
      case 'matching_headings':
      case 'matching_features':
        return (
          <MatchingSelectInput
            question={question}
            value={value}
            onChange={onChange}
          />
        );

      default:
        return Array.isArray(question.options) && question.options.length > 0 ? (
          <SingleChoiceInput
            question={question}
            value={value}
            onChange={onChange}
          />
        ) : (
          <InlineGapInput
            question={question}
            value={value}
            onChange={onChange}
          />
        );
    }
  };

  return (
    <div
      id={`question-${question.id}`}
      className="py-4 border-b border-gray-100 last:border-b-0 scroll-mt-6"
    >
      <div className="flex items-start gap-3">
        <span
          className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            isAnswered
              ? 'bg-emerald-500 text-white'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {question.number}
        </span>

        <div className="flex-1 min-w-0">{renderControl()}</div>
      </div>
    </div>
  );
}