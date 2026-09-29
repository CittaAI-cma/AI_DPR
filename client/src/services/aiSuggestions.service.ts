// @ts-nocheck
import { api } from '@/lib/api';

export interface AISuggestion {
  field: string;
  suggestion: string;
  reasoning?: string;
}

export class AISuggestionsService {
  /**
   * Get AI-driven suggestions for a specific step based on previous step data
   */
  static async getSuggestionsForStep(
    currentStep: number,
    currentStepData: any,
    previousStepsData: Record<string, any>,
    excludeFields?: string[]
  ): Promise<AISuggestion[]> {
    try {
      // Call backend API to get AI suggestions
      const response = await api.getAISuggestionsForClusterStep(
        currentStep,
        currentStepData,
        previousStepsData,
        excludeFields
      );
      
      if (response.success && response.data?.suggestions) {
        return response.data.suggestions;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      return [];
    }
  }

  /**
   * Get field-specific suggestions
   */
  static async getFieldSuggestions(
    fieldName: string,
    fieldValue: any,
    context: Record<string, any>
  ): Promise<string | null> {
    try {
      const response = await api.getAIFieldSuggestion(fieldName, fieldValue, context);
      if (response.success && response.data?.suggestion) {
        return response.data.suggestion;
      }
      return null;
    } catch (error) {
      console.error('Error fetching field suggestion:', error);
      return null;
    }
  }

  /**
   * Improve existing text for a form field (returns improved value only).
   */
  static async improveFieldText(
    fieldName: string,
    fieldValue: string,
    context: Record<string, any> = {}
  ): Promise<string | null> {
    try {
      const response = await api.improveFieldText(fieldName, fieldValue, context);
      if (response.success && response.data?.content) {
        return String(response.data.content);
      }
      return null;
    } catch (error) {
      console.error('Error improving field text:', error);
      return null;
    }
  }

  /**
   * Map free-text work description to one skill from the allowlist.
   */
  static async matchBusinessSkill(
    text: string,
    skills: string[],
    context: Record<string, any> = {}
  ): Promise<string | null> {
    try {
      const response = await api.matchBusinessSkill(text, skills, context);
      if (response.success && response.data?.skill) {
        return String(response.data.skill);
      }
      return null;
    } catch (error) {
      console.error('Error matching business skill:', error);
      return null;
    }
  }

  /**
   * Generate actual content for a field based on suggestion
   */
  static async generateFieldContent(
    fieldName: string,
    currentStep: number,
    currentStepData: any,
    previousStepsData: Record<string, any>,
    suggestion: string
  ): Promise<string | null> {
    try {
      const response = await api.generateFieldContent(
        fieldName,
        currentStep,
        currentStepData,
        previousStepsData,
        suggestion
      );
      if (response.success && response.data?.content) {
        return response.data.content;
      }
      return null;
    } catch (error) {
      console.error('Error generating field content:', error);
      return null;
    }
  }
}
