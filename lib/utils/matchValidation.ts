import { Match, MatchOfficial } from "@/types/models";

/**
 * Validation result type
 */
export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * Error messages
 */
const ERROR_MESSAGES = {
  DUPLICATE_TEAMS: "A hazai és a vendég csapat nem lehet ugyanaz",
  DUPLICATE_OFFICIALS: "A nevek nem egyezhetnek meg",
  REQUIRED_FIELDS: "Kérlek, tölts ki minden kötelező mezőt",
} as const;

/**
 * Validates that home and away teams are different
 * Only validates if both teams are provided
 */
export const validateTeams = (home: string, away: string): ValidationResult => {
  const homeTeam = home || "";
  const awayTeam = away || "";
  if (homeTeam !== "" && awayTeam !== "" && homeTeam === awayTeam) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.DUPLICATE_TEAMS,
    };
  }
  return { isValid: true };
};

/**
 * Helper function to check if two officials have the same username
 * Only returns true if both usernames are non-empty and match
 */
const areOfficialsDuplicate = (
  official1: MatchOfficial,
  official2: MatchOfficial
): boolean => {
  const username1 = official1.username || "";
  const username2 = official2.username || "";
  return (
    username1 !== "" &&
    username2 !== "" &&
    username1 === username2
  );
};

/**
 * Validates that match officials don't have duplicate assignments
 * Only validates non-empty official assignments
 * Note: Referee fields are optional, so this only checks for duplicates when fields are filled
 */
export const validateOfficialsDuplication = (
  referee: MatchOfficial,
  assist1: MatchOfficial,
  assist2: MatchOfficial,
  controllers: MatchOfficial[]
): ValidationResult => {
  // Check referee vs assistants (only if both are filled)
  if (areOfficialsDuplicate(referee, assist1)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.DUPLICATE_OFFICIALS,
    };
  }

  if (areOfficialsDuplicate(referee, assist2)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.DUPLICATE_OFFICIALS,
    };
  }

  // Check controllers vs other officials (only if controllers exist)
  if (controllers.length > 0) {
    const hasDuplicate = controllers.some(
      (c) =>
        areOfficialsDuplicate(c, referee) ||
        areOfficialsDuplicate(c, assist1) ||
        areOfficialsDuplicate(c, assist2)
    );
    if (hasDuplicate) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.DUPLICATE_OFFICIALS,
      };
    }
  }

  return { isValid: true };
};

/**
 * Validates required fields for single match
 * Note: Referee fields are NOT required - only home, away, date, time, and venue
 */
export const validateRequiredFieldsSingleMatch = (
  match: Match
): ValidationResult => {
  const { home, away, date, time } = match;
  if (
    !home ||
    !away ||
    !date ||
    !time
  ) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELDS,
    };
  }
  return { isValid: true };
};

/**
 * Validates required fields for non-single match (tournaments, 7s, etc.)
 */
export const validateRequiredFieldsNonSingleMatch = (
  match: Match
): ValidationResult => {
  const { date, time } = match;
  if (!date || !time) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELDS,
    };
  }
  return { isValid: true };
};

/**
 * Validates single match data (validates all rules for single match)
 * Allows empty referee fields - only validates duplicates when fields are filled
 */
export const validateSingleMatch = (match: Match): ValidationResult => {
  // Validate teams
  const teamsValidation = validateTeams(match.home, match.away);
  if (!teamsValidation.isValid) {
    return teamsValidation;
  }

  // Validate officials duplication (only checks non-empty fields)
  const officialsValidation = validateOfficialsDuplication(
    match.referee,
    match.assist1,
    match.assist2,
    match.controllers
  );
  if (!officialsValidation.isValid) {
    return officialsValidation;
  }

  // Validate required fields (referee fields are NOT required)
  const requiredFieldsValidation = validateRequiredFieldsSingleMatch(match);
  if (!requiredFieldsValidation.isValid) {
    return requiredFieldsValidation;
  }

  return { isValid: true };
};

/**
 * Validates non-single match data (tournaments, 7s, etc.)
 */
export const validateNonSingleMatch = (match: Match): ValidationResult => {
  return validateRequiredFieldsNonSingleMatch(match);
};
