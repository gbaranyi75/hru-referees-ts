import { Match, MatchOfficial } from "@/types/types";

/**
 * Validation result type
 */
export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * Validates that home and away teams are different
 * Only validates if both teams are provided
 */
export const validateTeams = (home: string, away: string): ValidationResult => {
  if (home !== "" && away !== "" && home === away) {
    return {
      isValid: false,
      error: "A hazai és a vendég csapat nem lehet ugyanaz",
    };
  }
  return { isValid: true };
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
  if (
    referee.username !== "" &&
    assist1.username !== "" &&
    referee.username === assist1.username
  ) {
    return {
      isValid: false,
      error: "A nevek nem egyezhetnek meg",
    };
  }

  if (
    referee.username !== "" &&
    assist2.username !== "" &&
    referee.username === assist2.username
  ) {
    return {
      isValid: false,
      error: "A nevek nem egyezhetnek meg",
    };
  }

  // Check controllers vs other officials (only if controllers exist)
  if (controllers.length > 0) {
    const hasDuplicate = controllers.some(
      (c) =>
        c.username === referee.username ||
        c.username === assist1.username ||
        c.username === assist2.username
    );
    if (hasDuplicate) {
      return {
        isValid: false,
        error: "A nevek nem egyezhetnek meg",
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
  const { home, away, date, time, venue } = match;
  if (
    home === "" ||
    away === "" ||
    date === "" ||
    time === "" ||
    venue === ""
  ) {
    return {
      isValid: false,
      error: "Kérlek, tölts ki minden kötelező mezőt",
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
  const { date, time, venue } = match;
  if (date === "" || time === "" || venue === "") {
    return {
      isValid: false,
      error: "Kérlek, tölts ki minden kötelező mezőt",
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
