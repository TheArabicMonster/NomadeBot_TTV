const helpers = require('../../utils/helpers');

describe('Helper functions', () => {
  describe('randomFromArray', () => {
    test('devrait retourner null pour un tableau vide', () => {
      expect(helpers.randomFromArray([])).toBeNull();
    });

    test('devrait retourner null pour un paramètre non-tableau', () => {
      expect(helpers.randomFromArray('string')).toBeNull();
      expect(helpers.randomFromArray(123)).toBeNull();
      expect(helpers.randomFromArray(null)).toBeNull();
      expect(helpers.randomFromArray(undefined)).toBeNull();
    });

    test('devrait retourner un élément du tableau', () => {
      const array = [1, 2, 3, 4, 5];
      const result = helpers.randomFromArray(array);
      expect(array).toContain(result);
    });

    test('devrait retourner le seul élément d\'un tableau avec un seul élément', () => {
      expect(helpers.randomFromArray([42])).toBe(42);
    });
  });

  describe('randomBetween', () => {
    test('devrait retourner un nombre entre min et max inclus', () => {
      const min = 5;
      const max = 10;
      for (let i = 0; i < 100; i++) { // Test multiple times to increase confidence
        const result = helpers.randomBetween(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
      }
    });

    test('devrait fonctionner avec des valeurs négatives', () => {
      const min = -10;
      const max = -5;
      const result = helpers.randomBetween(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    test('devrait retourner la même valeur si min et max sont égaux', () => {
      expect(helpers.randomBetween(7, 7)).toBe(7);
    });
  });

  describe('formatDuration', () => {
    test('devrait formater correctement les durées', () => {
      expect(helpers.formatDuration(1000)).toBe("1 seconde");
      expect(helpers.formatDuration(2000)).toBe("2 secondes");
      expect(helpers.formatDuration(60000)).toBe("1 minute");
      expect(helpers.formatDuration(120000)).toBe("2 minutes");
      expect(helpers.formatDuration(3600000)).toBe("1 heure");
      expect(helpers.formatDuration(7200000)).toBe("2 heures");
      expect(helpers.formatDuration(86400000)).toBe("1 jour");
      expect(helpers.formatDuration(172800000)).toBe("2 jours");
      expect(helpers.formatDuration(90000)).toBe("1 minute et 30 secondes");
      expect(helpers.formatDuration(3661000)).toBe("1 heure, 1 minute et 1 seconde");
    });

    test('ne devrait pas afficher les secondes pour les durées de plus d\'un jour', () => {
      expect(helpers.formatDuration(86400000 + 59000)).toBe("1 jour");
      expect(helpers.formatDuration(86400000 + 60000)).toBe("1 jour et 1 minute");
    });

    test('devrait gérer les très petites durées', () => {
      expect(helpers.formatDuration(100)).toBe("moins d'une seconde");
      expect(helpers.formatDuration(0)).toBe("moins d'une seconde");
    });
  });

  describe('truncateString', () => {
    test('devrait tronquer une chaîne trop longue', () => {
      expect(helpers.truncateString('abcdefghij', 5)).toBe('abcde...');
    });

    test('ne devrait pas tronquer une chaîne assez courte', () => {
      expect(helpers.truncateString('abcde', 5)).toBe('abcde');
      expect(helpers.truncateString('abc', 5)).toBe('abc');
    });

    test('devrait gérer les cas limites', () => {
      expect(helpers.truncateString('', 5)).toBe('');
      expect(helpers.truncateString(null, 5)).toBe(null);
      expect(helpers.truncateString(undefined, 5)).toBe(undefined);
    });
  });

  describe('isValidJson', () => {
    test('devrait retourner true pour un JSON valide', () => {
      expect(helpers.isValidJson('{"name":"John","age":30}')).toBe(true);
      expect(helpers.isValidJson('[]')).toBe(true);
      expect(helpers.isValidJson('123')).toBe(true);
      expect(helpers.isValidJson('"test"')).toBe(true);
      expect(helpers.isValidJson('true')).toBe(true);
      expect(helpers.isValidJson('null')).toBe(true);
    });

    test('devrait retourner false pour un JSON invalide', () => {
      expect(helpers.isValidJson('{')).toBe(false);
      expect(helpers.isValidJson('{"name":"John"')).toBe(false);
      expect(helpers.isValidJson('undefined')).toBe(false);
      expect(helpers.isValidJson('')).toBe(false);
    });
  });
});
