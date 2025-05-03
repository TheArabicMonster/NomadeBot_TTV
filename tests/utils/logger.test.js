const logger = require('../../utils/logger');

// Espionner console.log, console.error et console.warn
describe('Logger', () => {
  let consoleLogSpy;
  let consoleErrorSpy;
  let consoleWarnSpy;
  let originalNodeEnv;

  beforeEach(() => {
    // Sauvegarder l'environnement original
    originalNodeEnv = process.env.NODE_ENV;
    
    // Mettre en place des espions sur les méthodes console
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restaurer les espions après chaque test
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    
    // Restaurer l'environnement original
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('logger.info devrait appeler console.log avec le bon format', () => {
    logger.info('Test info message');
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    // Vérifier que le format contient [INFO] et le message
    const logCall = consoleLogSpy.mock.calls[0][0];
    expect(logCall).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[INFO\] Test info message/);
  });

  test('logger.error devrait appeler console.error avec le bon format', () => {
    logger.error('Test error message');
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    // Vérifier que le format contient [ERROR] et le message
    const errorCall = consoleErrorSpy.mock.calls[0][0];
    expect(errorCall).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[ERROR\] Test error message/);
  });

  test('logger.warn devrait appeler console.warn avec le bon format', () => {
    logger.warn('Test warning message');
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    // Vérifier que le format contient [WARN] et le message
    const warnCall = consoleWarnSpy.mock.calls[0][0];
    expect(warnCall).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[WARN\] Test warning message/);
  });

  test('logger.debug devrait appeler console.log avec le bon format en mode debug', () => {
    // Forcer le niveau de debug
    process.env.NODE_ENV = 'development';
    
    logger.debug('Test debug message');
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    // Vérifier que le format contient [DEBUG] et le message
    const debugCall = consoleLogSpy.mock.calls[0][0];
    expect(debugCall).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[DEBUG\] Test debug message/);
  });
  
  test('logger.debug ne devrait pas appeler console.log en mode production', () => {
    // Forcer le niveau de production
    process.env.NODE_ENV = 'production';
    
    logger.debug('Test debug message');
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
